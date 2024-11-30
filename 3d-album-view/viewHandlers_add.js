import './controls/FlowAlbumView';

viewHandlers.FlowAlbumView = inheritHandler('FlowAlbumView', 'BaseList', {
    controlClass: 'FlowAlbumView',
    title: _('3D Album view'),
    icon: 'browser',
    dataSourceType: 'albumlist',
    /**
     * To add sorting support for a view that does NOT inherit from a Tracklist:
     *  - sortingSupport true, sortBy, sortByNames
     *  - To get the setting to persist, you must include storePersistentState and restorePersistentState; see albumlistView.js
     */
    sortingSupport: true,
    controlClass_initParams: {
        autoSortString: 'title;artist'
    },
    sortBy: ['title;artist', 'year', 'artist'],
    sortByNames: [_('Album'), _('Date'), _('Album Artist')],
    onShow: function (control, view) {
        view.dataSourceCache.lastView = view.dataSourceCache.currentView;
        view.dataSourceCache.currentView = 'albumlist';
        
        view.mainControl = control.controlClass;
        
        // special case for if this is a playlist
        if (view.viewNode.dataSource && view.viewNode && view.viewNode.handlerID === 'playlist') {
            control.controlClass.playlist = view.viewNode.dataSource;
        }
        else control.controlClass.playlist = null;
        
        var albumList, tracks;
        
        albumList = view.dataSourceCache['albumlist'];
        tracks = view.dataSourceCache['tracklist'];
        
        if (albumList) console.log('Got from cache');
        
        if (!albumList) {
            // Playlist
            if (control.controlClass.playlist) {
                if (!tracks) {
                    tracks = control.controlClass.playlist.getTracklist();
                }
            }
            albumList  = control.controlClass.prepareDataSource(tracks, albumList);
        }
        
        if (!albumList) {
            if (view.viewNode.dataSource.getAlbumList) {
                albumList = view.viewNode.dataSource.getAlbumList();
                view.dataSourceCache['albumlist'] = albumList;
            }
            // else if (view.viewNode.dataSource.getTracklist) {
            //     console.log('getTracklist');
            //     tracks = view.viewNode.dataSource.getTracklist();
            //     albumList = control.controlClass.prepareDataSource(tracks);
            //     if (!albumList) alert('Returned album list not defined');
            //     view.dataSourceCache['tracklist'] = tracks;
            //     view.dataSourceCache['albumlist'] = albumList;
            // }
            else {
                alert('Couldn\'t find data source');
            }
        }
        if (!albumList) alert('Couldn\'t find albumList!');
        
        view.delayedAssign(albumList, function () {
            control.controlClass.dataSource = albumList;
            if (tracks)
                control.controlClass.completeTracklist = tracks;
        });
        
        if (control.controlClass) {
            control.controlClass.onShow();
        } 
    },
    onHide: function (control, view) {
        if (control.controlClass) {
            control.controlClass.onHide();
        } 
    },
    subViews: ['FlowAlbumView_tracks', 'statusBar'],
    hiddenSubViews: ['FlowAlbumView_tracks'],
});

viewHandlers.FlowAlbumView_tracks = inheritHandler('FlowAlbumView_tracks', 'TracklistBase', {
    controlClass: 'ColumnTrackList',
    title: function () {
        return _('Tracks');
    },
    icon: 'song',
    placement: {
        position: 'bottom',
        hasSplitter: true,
        inScroller: false,
    },
    onShow: function (control, view) {
        // make it accessible to the FlowAlbumView control via parentNode
        view.tracklistControl = control.controlClass;
        
        // control.classList.add('threeDView-tracklist');
        
        // The following is copied from the ColumnTracklist control
        if (this.controlClass_initParams && this.controlClass_initParams.showHeader == false)
            control.controlClass.showHeader = false;
        else
            control.controlClass.showHeader = true;

        var sortString = window.uitools.getDefaultColumnSort(view);
        if (sortString) {
            if (sortString == 'none')
                sortString = '';
            control.controlClass.getDefaultSortString = function () {
                return sortString;
            };
            control.controlClass.setSortColumns(sortString);
        }

        viewHandlersClasses['Tracklist'].$super.onShow.apply(this, arguments);
        
        if (view.mainControl) {
            view.mainControl.refreshTracklistDS();
            
            // Force the view to render a few extra frames, so that you don't get the ugly stretching effect
            view.mainControl.triggerSmoothResize(animTools.animationTime * 1000);
            // Force the 3DController to grab the tracklist
            if (view.mainControl.controller) view.mainControl.controller._updateCurrentAlbum(true);
        } 
        
        if (view.mainControl && view.mainControl.focusedTracklist) {
            control.controlClass.dataSource = view.mainControl.focusedTracklist;
        }
        else {
            // Initialize the list as empty so it does not default to all tracks
            control.controlClass.dataSource = utils.createSharedList();
        }
    },
    onHide: function (control, view) {
        view.tracklistControl = undefined;
        viewHandlersClasses['Tracklist'].$super.onHide.apply(this, arguments);
        
        if (view.mainControl) {
            view.mainControl.clearTracklistDS();
            // Force the view to render a few extra frames, so that you don't get the ugly stretching effect
            view.mainControl.triggerSmoothResize(animTools.animationTime * 1000);
        } 
    },
    // These params are necessary for the tracklist view to open smoothly, at a specified height
    controlClass_initParams: {
        minHeight: function () { // use function, so it is computed later, when document.body always exists
            return 3 * fontLineSizePx() + 'px';
        },
        height: function () {
            return 14 * fontLineSizePx() + 'px';
        },
    },    
});

viewHandlers.FlowAlbumViewNowPlaying = inheritHandler('FlowAlbumViewNowPlaying', 'FlowAlbumView', {
    controlClass: 'FlowAlbumViewNowPlaying',
    title: _('3D Album view'),
    icon: 'browser',
    dataSourceType: 'albumlist',
    onShow: function (control, view) {
        view.mainControl = control.controlClass;
        
        this.refreshDataSource = (async function () {
            var songlist = await app.player.getSongList().whenLoaded();
            if (songlist.whenMetadataLoaded)
                await songlist.whenMetadataLoaded();
            var tracklist = await songlist.getTracklist().whenLoaded();
            var ds = await tracklist.getAlbumList().whenLoaded();
            
            control.controlClass.dataSource = ds;
            control.controlClass.completeTracklist = tracklist;
            // Set it to the right focused album
            if (control.controlClass.handlePlaybackStateChange) {
                control.controlClass.handlePlaybackStateChange('play');
            }
        }).bind(this);
        
        // Refresh data source both now and when the now playing list has been modified
        app.listen(app.player, 'nowPlayingModified', this.refreshDataSource);
        this.refreshDataSource();
        setTimeout(this.refreshDataSource, 8000);
        
        control.controlClass.onShow();
    },
    onHide: function (control, view) {
        app.unlisten(app.player, 'nowPlayingModified', this.refreshDataSource);
        if (control.controlClass) {
            control.controlClass.onHide();
        }
    }
});

viewHandlers.artistview_FlowAlbumView = inheritHandler('artistview_FlowAlbumView', 'Base', {
    controlClass: 'ArtistFlowAlbumView',
    title: _('Albums (3D)'),
    icon: 'browser',
    placement: {
        position: 'top',
        inScroller: true,
    },
    onShow: function (control, view) {
        var cachedDS = view.dataSourceCache['artistView_3D'];
        if (!cachedDS) {            
            if (view.viewNode.dataSource) {
                cachedDS = view.viewNode.dataSource.getAlbumList();
            }
            else {
                cachedDS = app.utils.createAlbumlist();
            }
            
            view.dataSourceCache['artistView_3D'] = cachedDS;
        };
        control.controlClass.dataSource = view.dataSourceCache['artistView_3D'];
        
        control.controlClass.onShow();
    },
    onHide: function (control, view) {
        if (control.controlClass) {
            control.controlClass.onHide();
        }
    }
});


viewHandlers.artistView.subViews.splice(2, 0, 'artistview_FlowAlbumView');
nodeHandlers.albums.viewAs.push('FlowAlbumView');
nodeHandlers.playlist.viewAs.push('FlowAlbumView');
nodeHandlers.tracks.viewAs.push('FlowAlbumView');