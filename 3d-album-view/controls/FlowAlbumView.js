"use strict";

requirejs('controls/control');
requirejs('controls/trackListView');
requirejs('controls/albumlistView');
localRequirejs('three.min.js');
localRequirejs('3DController.js');

if (!window._FlowAlbumViewErrors)
    window._FlowAlbumViewErrors = []; // for error catching (to be removed later)

// let ODS = msg => {if (msg && msg.startsWith('Flow')) console.log(msg)}

inheritClass('FlowAlbumView', Control, {
    initialize: function (parentElem, params) {
        params.dynamicSize = false;
        FlowAlbumView.$super.initialize.apply(this, arguments);
        
        const _this = this;
        this.isSearchable = true; // for search bar
        
        var elem = document.createElement('div');
        parentElem.appendChild(elem);
        parentElem.classList.add('fill');
        parentElem.setAttribute('tabindex', '-1');
        
        this.parent = elem;
        elem.classList.add('fill');

        // Settings
        this.loadSettings();

        // For default background color: Skins can override it by adding to their LESS:
        //  .threeDView-defaultStyles{ background-color: [color]!important; }
        let defaultStylesElem = document.createElement('div');
        defaultStylesElem.classList.add('threeDView-defaultStyles');
        elem.appendChild(defaultStylesElem);
        // This is a CSS computed style, so changes to the LESS/CSS will automatically be reflected in this object
        this.defaultStyles = getComputedStyle(defaultStylesElem);
        
        this._setCornerBoxText = (msg) => {
            if (this.settings.textBoxVisible) this.cornerTextBox.innerText = msg;
        }
        
        this.cornerTextBox = document.createElement('div');
        this.cornerTextBox.classList.add('threeDView-CornerTextBox');
        elem.appendChild(this.cornerTextBox);
        
        this.settingsButton = document.createElement('div');
        this.settingsButton.setAttribute('data-control-class', 'ToolButton');
        this.settingsButton.setAttribute('data-icon', 'options');
        this.settingsButton.setAttribute('data-tip', 'Options');
        this.settingsButton.classList.add('threeDView-settingsButton');
        initializeControl(this.settingsButton);
        this.settingsButton.controlClass.contextMenu = new Menu([{
            title: _('Preload Album Art (May take some time)'),
            execute: () => {
                if (_this.controller) _this.controller.preloadThumbnails();
            }
        }]);
        elem.appendChild(this.settingsButton);

        window.flow = this;

        ODS('FlowAlbumView - init');

        this.boundingRect = elem.getBoundingClientRect();

        this.camera = new THREE.PerspectiveCamera(50, this.boundingRect.width / this.boundingRect.height, 0.1, 1000);
        this.scene = new THREE.Scene();
        // Set the scene's background color
        this._setSceneBackground();

        ODS('FlowAlbumView - Creating controller')
        this.controller = new FlowController(this);

        // ThreeJS scene stuff
        this._setCameraPosition();
        const light = new THREE.PointLight(0xffffff, 2, 14, 1.5);
        light.position.set(0, 5, 3);
        this.scene.add(light);
        const ambientLight = new THREE.AmbientLight(0x484848); // soft white light
        this.scene.add(ambientLight);

        this.createNewContext();
        this.animationFrameTimeout = requestFrame(this.animate.bind(this));
        
        this._initializeTime = Date.now(); // this is to improve the smoothness of the appearance for the first few seconds of the control initializing
        
        // If the control has been initialized when the window is starting, do a bunch of resize events to avoid the ugly stretching effect for a few seconds
        if (!window._windowIsReady) {
            whenReady(() => {
                let resizeInterval = setInterval(this.onResize.bind(this), 300);
                requestTimeout(() => {
                    clearInterval(resizeInterval);
                }, 2000);
            });
        }
        
        // Context menu
        //  The context menu population is handled by the rest of MM. 
        //  For tracklistmenus, it depends on the datasource's getSelected (set in 3DController)
        var _contextMenu = menus.createTracklistMenu(elem);
        this.contextMenu = () => {
            if (this.controller && this.controller._mousedOverObject && this.controller._mousedOverObject.mesh.visible) {
                return _contextMenu;
            }
        }
		
        this.onDoubleClick = function(e) {
            if (_this.doubleClickDisabled) return;
            let mousedOverObject = _this.controller._mousedOverObject;
            // If object is in the center
            if (mousedOverObject && _this.controller.dataSource && Math.abs(mousedOverObject.position) < 0.1) {
                // Make sure the carousel is not in the middle of moving
                if (_this.controller.position - _this.controller.target < 0.2) {
                    let index = parseInt(-1 * _this.controller.target);
                    _this.controller.dataSource.locked(async () => {
                        let album = _this.controller.dataSource.getValue(index);
                        if (album) {
                            let tracklist = album.getTracklist();
                            await tracklist.whenLoaded();
                            if (_this.parentView.viewNode.handlerID === 'playlist') {
                                // only allow the songs that are IN the playlist to play (not the whole album)
                                tracklist = await _this.controller.filterFromPlaylist(tracklist);
                            }
                            await player.stopAsync();
                            await player.addTracksAsync(tracklist, { withClear: true });
                            player.playAsync();
                        }
                        else ODS('FlowAlbumView - no album');
                    });
                }
            }
        }
        
        // This is to open the settings menu with the button
        var addonList = app.getAddonList('views');
        addonList.whenLoaded().then(() => {
            addonList.forEach(itm => {
                if (itm.ext_id.toLowerCase() === '3d album view') {
                    this.addon = itm;
                }
            })
        })
        
        this._handleSettingsChange = function() {
            this.loadSettings();
        }.bind(this);

        this.localListen(elem, 'keydown', handleKeypress, true);
        this.localListen(elem, 'mousemove', onMouseMove, false);
        this.localListen(elem, 'layoutchange', onLayoutChange);
        this.localListen(this.container, 'datasourcechanged', onDataSourceChanged);
        this.localListen(this.renderer.domElement, 'webglcontextlost', onContextLost);
        this.localListen(elem, 'wheel', onMouseWheel);
        app.listen(elem, 'dblclick', this.onDoubleClick);
        app.listen(app, 'settingschange', this._handleSettingsChange);
        app.listen(app, 'playlistchange', (playlist) => {
            if (this.playlist && playlist.id === this.playlist.id) {
                clearTimeout(this.playlistChangeTimeout);
                this.playlistChangeTimeout = requestTimeout(async () => {
                    ODS('FlowAlbumView - Playlist changed; updating DS');
                    let tracklist = await _this.playlist.getTracklist();
                    if (tracklist.getAlbumList) {
                        let newDS = await tracklist.getAlbumList();
                        // sanity check to make sure the view's playlist hasn't changed
                        if (_this.playlist && playlist.id === _this.playlist.id) {
                            _this.dataSource = newDS;
                            // _this.completeTracklist = tracklist; This line also has to be fired under datasourcechanged, in case user switches straight from a different view to a playlist
                        }
                    }
                    else throw new Error('getAlbumList undefined!!');
                }, 2000); // wait 2s for another change, if there isn't any then update the data source
            }
        })
        this.localListen(this.settingsButton, 'click', () => {
            if (_this.addon) {
                uitools.openDialog('dlgAddonConfig', {
                    modal: true,
                    addon: _this.addon
                }, () => {
                    
                });
            }
        });
        this.localListen(window, 'lesschange', () => {
            this.defaultStyles = getComputedStyle(defaultStylesElem);
            this.loadSettings();
        });
        
        _this.resizeTicking = false;

        function onMouseWheel(e) {
            _this.controller.onMouseWheel(e);
        }

        function onMouseMove(e) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            
            if (_this.isArtistView) {
                // Artist view screws with the bounding box; must calculate slightly differently
                _this.controller.mouse.x = ((e.clientX - _this.boundingRect.left - _this.boundingRect.width) / _this.boundingRect.width) * 2 - 1;
            }
            else {
                _this.controller.mouse.x = ((e.clientX - _this.boundingRect.left) / _this.boundingRect.width) * 2 - 1;
            }
            _this.controller.mouse.y = - ((e.clientY - _this.boundingRect.top) / _this.boundingRect.height) * 2 + 1;
        }

        function handleKeypress(e) {
            var handled = false;

            if (e.key === 'ArrowLeft') {
                _this.controller.moveRight();
                handled = true;
            }
            else if (e.key === 'ArrowRight') {
                _this.controller.moveLeft();
                handled = true;
            }
        }

        function onLayoutChange(e) {
            let id = e.detail.uniqueLayoutChangeID;
            if (id !== this._lastLayoutChangeID) {
                _this.onResize();
                this._lastLayoutChangeID = id;
            }
        }
        
        async function onDataSourceChanged() {
            if (_this.controller) _this.controller.setDataSource(_this._dataSource);
            
            if (this.playlist) {
                let tracklist = await _this.playlist.getTracklist();
                _this.completeTracklist = tracklist; // #18722
            }
            
            // To allow cached thumbnails to appear more quickly
            _this.triggerTemporaryForcedFrames();
        }

        // Handler for WebGL context loss event
        function onContextLost() {
            console.log('contextLost');
            if (!document.hidden) {
                console.log('document not hidden');
                restoreContext();
            }
            else {
                app.listen(document, 'visibilitychange', restoreContext);
            }
        }

        function restoreContext() {
            // For some reason, the WebGL context loses its WEBGL_lose_context extension, 
            //  which ThreeJS depends on to do a forceContextRestore() event. Therefore, it is best to destroy and re-create
            //  the renderer.

            if (document.visibilityState === 'visible') {
                _this.createNewContext();
                
                cancelAnimationFrame(_this.animationFrameTimeout);
                _this.animationFrameTimeout = requestFrame(_this.animate.bind(_this));

                app.unlisten(document, 'visibilitychange', restoreContext);
            }
            else {
                console.log('Document not visible; doing nothing');
            }
        }
    },
    // Needed for reliable "Play now"/"Play next"/etc., used in getSelectedTracklist in actions.js
    getTracklist: function () {
        return this.focusedTracklist;
    },
    _incrementalSearchMessageSuffix: function () {
        return ''; // not supported
    },
    // for "scrolls to match" searching
    performIncrementalSearch: function(searchPhrase) {
        if (!searchPhrase || searchPhrase == '') return;

        this.controller.scrollToLetter(searchPhrase);

        return true;
    },
    // for search bar filtering
    filterSource: function(searchPhrase) {
        // If the search phrase is empty, un-filter the albums
        if (!searchPhrase || searchPhrase == '' || searchPhrase == ' ') {
            this.controller.resetFilter();
            return;
        }
        this.controller.filterAlbums(searchPhrase);
    },
    // Required for the search bar
    showToast: function (message) {
        uitools.toastMessage.show(message, {
            disableClose: true,
            delay: 3000,
        });
    },
    loadSettings: function() {
        // To show a tooltip if the thumbnail setting has changed
        if (this.settings) 
            var prevThumbnailSetting = this.settings.highResThumbnails; 

        this.settings = app.getValue('FlowAlbumView_settings', {
            spacingMultiplier: 1,
            disablePerspectiveDistortion: false,
            capFramerate: false,
            textBoxVisible: true,
            highResThumbnails: true,
            backgroundColor: undefined,
            useHotlinks: true,
            throttleCarouselSpeed: true,
            mouseWheelScrollNumber: undefined,
            textFields: {
                header: 'title',
                subheader: 'albumArtist',
                line1: 'date',
                line2: 'description'
            },
            textHotlinks: {
                header: 'album',
                subheader: undefined,
                line1: 'year',
                line2: undefined
            }
        });
        if (this.controller) this.controller.handleSettingsChange();
        // Update the scene's background color
        if (this.scene) {
            this._setSceneBackground();
        }
        if (this.camera) {
            this._setCameraPosition();
        }
        if ((typeof prevThumbnailSetting !== undefined) && prevThumbnailSetting != this.settings.highResThumbnails) {
            if (this.controller && this.controller.albumArts) this.controller.albumArts.clear(true)
        }
    },
    _setSceneBackground: function() {
        let rgb = this.settings.backgroundColor;
        if (rgb) this.scene.background = new THREE.Color(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
        else this.scene.background = new THREE.Color(this.defaultStyles.backgroundColor);
    },
    cleanUp: function() {

        // Unlisten events and cancel the render frame
        app.unlisten(this.parent);
        app.unlisten(this.container);
        cancelAnimationFrame(this.animationFrameTimeout);

        // Clean up and dispose of THREE.js objects.
        this.controller.cleanUp();
        this.renderer.dispose();

        this.renderer = null;
        this.controller = null;
        this.scene = null;
        this.camera = null;
        // window.flow = null;

        FlowAlbumView.$super.cleanUp.call(this);
    },
    createNewContext: function() {
        const _this = this;
        try {
            cancelAnimationFrame(this.animationFrameTimeout);

            if (this.renderer) {
                let oldCanvas = this.renderer.domElement;
                this.parent.removeChild(oldCanvas);
                app.unlisten(this.renderer.domElement, 'mousedown', onMouseDown);
            }
            console.log('Creating new context');

            // this.renderer = null;
            // console.log('creating tempRenderer');
            var tempRenderer = new THREE.WebGLRenderer({ antialias: true });
            // console.log('created tempRenderer');
            this.renderer = tempRenderer;

            this.renderer.setSize(this.boundingRect.width, this.boundingRect.height);
            this.parent.appendChild(this.renderer.domElement);

            // this.controls = new OrbitControls( this.camera, this.renderer.domElement );
            
            this.localListen(this.renderer.domElement, 'mousedown', onMouseDown);
        }
        catch (err) {
            this._setCornerBoxText(err.toString());
            console.error(err);
        }

        function onMouseDown(e) {
            window.lastFocusedControl = _this.container;
            _this.controller.onMouseDown(e);
        }
    },
    _setCameraPosition: function() {
        var ratio = this.camera.aspect;
        
        if (this.settings.disablePerspectiveDistortion) {
            this.camera.position.y = 2;
            this.camera.position.z = 9.5;
        }
        else {
            this.camera.position.y = 3.8;
            this.camera.position.z = 9.5;
        }
        
        // Update the camera's fov and angle, and album spacing, depending on the view's aspect ratio
        if (ratio > 2.5) {
            let ratioDiff = ratio - 2.5;
            this.controller.SPACING = Math.min(1.5 + ratioDiff / 2.2, 3.1) * this.settings.spacingMultiplier;
            this.camera.fov = Math.max(50 - ratioDiff * 4.5, 30);
            this.camera.lookAt(0, Math.min(-0.5 + ratioDiff / 5, 0.075), 0);
        }
        else {
            this.controller.SPACING = 1.5 * this.settings.spacingMultiplier;
            this.camera.fov = 50;
            this.camera.lookAt(0, -0.5, 0);
        }
    },
    onResize: function() {
        if (!this.resizeTicking) {
            this.requestTimeout(() => {
                if (this.controller.enabled) {
                    this.boundingRect = this.parent.getBoundingClientRect();

                    const aspect = this.boundingRect.width / this.boundingRect.height;
                    this.camera.aspect = aspect;
                    this.camera.updateProjectionMatrix();
                    this._setCameraPosition();
                    
                    this.renderer.setSize(this.boundingRect.width, this.boundingRect.height);
                    
                    this.resizeTicking = false;

                    this.controller.updateDOMControlSize();
                    this.controller.updateTextSize(this.boundingRect.height);
                    
                    this.triggerTemporaryForcedFrames();
                }
            }, 16, 'resize');
            this.resizeTicking = true;
        }
    },
    onShow: function() {
        this.animationFrameTimeout = requestFrame(this.animate.bind(this));
    },
    onHide: function() {
        cancelFrame(this.animationFrameTimeout);
    },
    animate: function() {
        if (this.renderer && this.controller) {
            
            // if (!this.hasOwnProperty('numFrames')) this.numFrames = 0;
            // this._setCornerBoxText(++this.numFrames);

            let didRender = this.controller.animate();

            // let st = Date.now();
            // let end = st;
            if (didRender) {
                this.renderer.render(this.scene, this.camera);
                // end = Date.now();
                
                // let prevLastFrameTime = this.prevLastFrameTime;
                // let lastFrameTime = this.lastFrameTime;
                // this.lastFrameTime = end;
                // this.prevLastFrameTime = lastFrameTime;
            }
            
            // Force a smooth resize if necessary
            if (didRender && this.forceSmoothResize) {
                this.onResize();
            }

            if (this.controls) this.controls.update();
            
            if (window.cancelFrame)
                cancelFrame(this.animationFrameTimeout);
            this.animationFrameTimeout = requestFrame(this.animate.bind(this));
        }
    },
    /**
     * Temporarily force the view to render every frame for a short amount of time, to provide a smoother experience during important transitions.
     * @param {number} [duration] Duration in ms
     */
    triggerTemporaryForcedFrames: function(duration) {
        if (!duration) duration = 50;
        if (this.controller) {
            this.controller.forceRefresh = true;
            this.requestTimeout(() => {if (this.controller) this.controller.forceRefresh = false;}, duration, 'forcedFrames');
        }
    },
    /**
     * 
     * @param {number} [duration] Duration in ms
     */
    triggerSmoothResize: function(duration) {
        if (!duration) duration = 50;
        if (this.controller) {
            this.forceSmoothResize = true;
            this.requestTimeout(() => {this.forceSmoothResize = false;}, duration, 'smoothResize');
        }
        this.triggerTemporaryForcedFrames(duration);
    },
    // I don't want to load the tracklist inside the controller when the tracklist isn't loaded,
    //  so this is a way to force the controller to load the tracklist when the subview is shown
    refreshTracklistDS: function() {
        this.completeTracklist = this.completeTracklist;
        this.controller._updateCurrentAlbum(true);
    },
    // Clear the tracklist data source from mem
    clearTracklistDS: function() {
        this._focusedTracklist = app.utils.createTracklist();
    },
    
    // See controls/albumlistView
    prepareDataSource: function(tracks, cachedDS) {
        var ret = AlbumListView.prototype.prepareDatasource.call(this, tracks, cachedDS);
        this.completeTracklist = tracks;
        return ret;
    },
    
    storePersistentState: function () {
        var state = {};
        state.sorting = this.autoSortString;
        return state;
    },

    restorePersistentState: function (state) {
        if (state.sorting) {
            this.autoSortString = state.sorting;
            // this._refreshDataSource(this._dataSource); // When we restore our state, we must make sure our controller knows 
        };
    },
    
    // In restorePersistentState I need to update the data source, so I put it into a separate function so I didn't have to do "this.dataSource = this.dataSource;" (which feels wrong on so many levels)
    _refreshDataSource: function(ds) {
        // Return if the datasource is the same and the auto sort has not changed
        if ((this._dataSource == ds && this._lastAutoSortString === this.autoSortString) || !ds) return;
        
        // console.log(`Sorting string: ${this.autoSortString}`, new Date());
        
        this._lastAutoSortString = this.autoSortString;
        this._sortingPromise = ds.setAutoSortAsync(this.autoSortString);
        this._sortingPromise.then(() => {
            // console.log('Done sorting');
            this._sortingPromise = undefined;
        });
        
        // console.log('Updating dataSource');
        
        this._dataSource = ds;
        if (this._dataSource) {
            // do stuff for new data source
            this._dataSource.getTracklist = function () {
                return app.utils.createTracklist();
            }
        }
        
        if (this.parentView.viewNode.handlerID === 'playlist') {
            this.isPlaylist = true;
        }
        else this.isPlaylist = false;

        var evt;
        evt = createNewCustomEvent('datasourcechanged', {
            detail: {
                newDataSource: this._dataSource
            },
            bubbles: true,
            cancelable: true
        });
        this.container.dispatchEvent(evt);
    }
}, {
    /**
     Gets/sets the datasource which is/will be shown
        NOTE: This data source is never filtered. The filtering is done inside 3DController. To access filtered DS, use this.controller.dataSource.

    @property dataSource
    @type object
    */
    dataSource: {
        get: function () {
            return this.controller ? this.controller.dataSource : this._dataSource;
        },
        set: function (ds) {
            this._refreshDataSource(ds);
        }
    },
    // Resolves when DS is loaded & sorting is done; if we're not waiting for sort, it resolves instantly
    dataSourceReady: {
        get: function () {
            return new Promise((resolve, reject) => {
                this._dataSource.whenLoaded()
                .then(() => {
                    if (this._sortingPromise) {
                        this._sortingPromise.then(resolve);
                    }
                    else {
                        resolve();
                    }
                });
            })
        }
    },
    /**
     * This is for when it's a playlist, so we can filter the tracklist within the playlist
     */
    completeTracklist: {
        get: function () {
            return this._completeTracklist;
        },
        set: function(newList) {
            if (this._completeTracklist == newList && this._completeTracklistLoaded) return console.log('completeTracklist: Update not necessary');
            this._completeTracklist = newList;
            this._completeTracklistLoaded = false;
            
            if (!this.needsTracklist || !newList) return console.log('completeTracklist: skipping', !this.needsTracklist, !newList); // Skip unnecessary computation. refreshTracklistDS will make this run a second time if needed
            
            // tracklistIDs will resolve when, as the name implies, the tracklist IDs are ready
            this.tracklistIDs = new Promise((resolve, reject) => {
                this._completeTracklist.whenLoaded()
                .then(() => {
                    let tracklistIDsArr;
                    
                    // post 5.0.2
                    if (typeof this._completeTracklist.getAllValues === 'function') {
                        tracklistIDsArr = new Int32Array(this._completeTracklist.getAllValues('idsong'));
                        resolve(tracklistIDsArr);
                    }
                    // pre 5.0.2
                    else {
                        tracklistIDsArr = new Int32Array(this._completeTracklist.count);
                        this._completeTracklist.locked(() => {
                            let song;
                            for (let i = 0; i < tracklistIDsArr.length; ++i) {
                                song = this._completeTracklist.getFastObject(i, song);
                                tracklistIDsArr[i] = song.idsong;
                            }
                            resolve(tracklistIDsArr);
                        });
                    }
                    
                    this._completeTracklistLoaded = true;
                });
            });
        }
    },
    // whether the controller needs to load the tracklist
    needsTracklist: {
        get: function () {
            return (this.parentView && this.parentView.tracklistControl);
        },
    },
    /**
     * This is the tracklist of the currently focused album
     */
    focusedTracklist: {
        get: function () {
            return this._focusedTracklist;
        },
        set: function (ds) {
            this._focusedTracklist = ds;
            // Assign the data source to the tracklist control
            if (this.parentView && this.parentView.tracklistControl) {
                this.parentView.tracklistControl.dataSource = ds;
            }
        }
    },
    /**
     * The supported autoSortStrings are set in viewHandlers_add.js.
     * The autoSortString is set in either multiview.js or dlgEditView.js, and when it's set, we have to update our dataSource's autoSortString.
     * That's done in _refreshDataSource().
     */
    autoSortString: {
        get: function () {
            return this._autoSortString;
        },
        set: function (string) {
            this._autoSortString = string;
            this._refreshDataSource(this._dataSource); // When we modify our sort string, we must update our data source & make sure our controller knows 
        }
    }
});