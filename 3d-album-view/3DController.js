// It's much simpler and faster to save the no-album-art image in memory this way, instead of having to load a file
const noImageURI = "data:image/png;base64,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";

const NUM_ALBUMS_VISIBLE = 8;
const PICTURE_SIZE = 6;
const TOTAL_GEOMETRIES = 3 + (NUM_ALBUMS_VISIBLE * 2);
var   SCROLL_SPEED = 0.145;
const FAST_MOVE_THRESHOLD = 50;
const MIN_FRAME_TIME = 2000;
const MIN_FRAME_TIME_STARTUP = 150; // Min frame time for the first few seconds of the control being initialized
const WHEEL_AMOUNT = 0.12; // ratio of items scrolled to mouse wheel deltaY
const HIGH_PICTURE_QUALITY = 512;
const LOW_PICTURE_QUALITY = 200;
var   SPACING = 1.5;
const WIDE_SPACING_MULTIPLE = 2;
const fullDebug = false;

function displayToast(message) {
    uitools.toastMessage.show(message, {
        disableClose: true,
    });
}

window.whenReady(() => {
    if (window.Stats) {
        window.stats = new Stats();
        // 0: fps, 1: ms, 2: mb, 3+: custom
        stats.showPanel( 0 );
        document.body.appendChild( stats.dom );
        stats.begin();
        window.customPanel = stats.addPanel( new Stats.Panel( 'x', '#ff8', '#221' ) );
    }
    else {
        window.stats = {begin: ()=>{}, end: () => {}, update: () => {}}  
        window.customPanel = {update: ()=>{}};
    } 
});

class AlbumArtController{
	constructor(gradColor) {
        this.loader = new THREE.TextureLoader();
		this.arts = [];
		this.paths = [];
        this.pathsById = [];
        this.cancelTokens = {};
        this.loadedTextures = {}; // To cache already-loaded textures (by path)
        this.gradientCanvas = document.createElement('canvas');
        this.gradientCanvas.width = 256;
        this.gradientCanvas.height = 256;
        this.gradientCtx = this.gradientCanvas.getContext('2d');
		this.noImage = this.loader.load(noImageURI);
        this.noImage.name = 'noImage';
		this.gradient = this.loader.load(this.getGradientURI(gradColor[0], gradColor[1], gradColor[2]));
        this.gradient.name = 'gradient';
        this.isPreloadingAA = false;
	}
	getArt(index, isMovingFast, forceLoadTexture, callback) {
        index = parseInt(index); // in the case where index is "-0", it results in a crash so we need to turn -0 into 0
        
        const _this = this;
        
		let art = this.arts[index];
		if (art && art.image) {
            if (callback) callback();
			return art;
		}
		else {
			//load image, but in the meantime, return the noImage bit
			if (this.paths[index] && !this.cancelTokens[index]) {
                loadArtByPath(this.paths[index]);
			}
            // if thumb has not been loaded yet, then load it and save to the paths array
            else {
                if (this.dataSource && !isMovingFast) {
                    this.dataSource.locked(() => {
                        if (!this.PICTURE_QUALITY) this.PICTURE_QUALITY = HIGH_PICTURE_QUALITY;
                        
                        let album = this.dataSource.getValue(index);                
                        if (album) {
                            let cancelToken = album.getThumbAsync(this.PICTURE_QUALITY, this.PICTURE_QUALITY, path => {
                                this.paths[index] = path;
                                delete this.cancelTokens[index];
                                loadArtByPath(path); // Load the art so that it's ready by the next frame (this is inside an async callback so we're not doing it 2x in one call)
                                if (forceLoadTexture && fullDebug) ODS(`FlowController - Force loading ${index}`);
                            });
                            this.cancelTokens[index] = cancelToken;
                        }
                        else if (callback) callback(true); // done with preloading thumbs
                    });
                }
            }
			return this.noImage;
		}
        
        function loadArtByPath(path) {
            let resolvedPath = resolveToValue(path);
            if (fullDebug) ODS(`FlowController - Loading index=${index} path ${resolvedPath}`);
            if (!resolvedPath) return;
            if (_this.loadedTextures[resolvedPath]) {
                _this.arts[index] = _this.loadedTextures[resolvedPath];
                _this.refreshFrameRequested = true; // Request to the controller that we want a frame to be rendered
            }
            else {
                let newTexture =  _this.loader.load(resolvedPath, () => {
                    _this.refreshFrameRequested = true; // Request to the controller that we want a frame to be rendered
                });
                newTexture.name = resolvedPath;
                _this.arts[index] = newTexture;
                _this.loadedTextures[resolvedPath] = newTexture;
            }
            if (callback) callback();
        }
	}
    flushUnfinishedTasks(visibleStart, visibleEnd) {
        if (this.isPreloadingAA) return; // If we're preloading AA, we don't want to cancel these tasks
        
        let tokensToDelete = [];
        for (let key in this.cancelTokens) {
            let idx = parseInt(key);
            if (idx < visibleStart || idx > visibleEnd) {
                app.cancelLoaderToken(this.cancelTokens[idx]);
                // Can't delete items in this.cancelTokens while iterating through it
                tokensToDelete.push(idx);
            }
        }
        for (let idx of tokensToDelete) {
            delete this.cancelTokens[idx];
        }
    }
    changeGradient(gradColor) {
        this.gradient = this.loader.load(this.getGradientURI(gradColor[0], gradColor[1], gradColor[2]));
    }
    getGradientURI(r,g,b) {
        let ctx = this.gradientCtx;
        let canv = this.gradientCanvas;
        const WIDTH = 256;
        
        var grd1 = ctx.createLinearGradient(0, 0, 0, WIDTH);
        grd1.addColorStop(0, rgba(r,g,b,0));
        grd1.addColorStop(1, rgba(r,g,b,1));
        
        var grd2 = ctx.createLinearGradient(0, 0, 0, WIDTH);
        grd2.addColorStop(0, rgba(r,g,b,0.35));
        grd2.addColorStop(0.33, rgba(r,g,b,0.6));
        
        var grd3 = ctx.createLinearGradient(0, 0, 0, WIDTH);
        grd3.addColorStop(0.22, rgba(r,g,b,0));
        grd3.addColorStop(1, rgba(r,g,b,0.3));
        
        ctx.clearRect(0, 0, WIDTH, WIDTH);
        ctx.fillStyle = grd1;
        ctx.fillRect(0, 0, WIDTH, WIDTH);
        ctx.fillStyle = grd2;
        ctx.fillRect(0, 0, WIDTH, WIDTH);
        ctx.fillStyle = grd3;
        ctx.fillRect(0, 0, WIDTH, WIDTH);
        
        const uri = canv.toDataURL();
        return uri;
        
        function rgba(r,g,b,a) {
            return 'rgba(' + String(r) + ',' + String(g) + ',' + String(b) + ',' + String(a) + ')';
        }
    }
	cleanUp() {
        this.clear(true);
		this.arts = null;
		this.paths = null;
        this.pathsById = null;
        this.loader = null;
	}
    setDataSource(newDataSource) {
        this.dataSource = newDataSource;
        // Reset arts and paths, but don't reset the cached thumbs by path (since loading a texture takes time)
        this.clear();
    }
    clear(purgeImages) {
        // Clear memory used by cached images
        if (purgeImages == true) {
            for (let path in this.loadedTextures) {
                if (this.loadedTextures.hasOwnProperty(path))
                    delete this.loadedTextures[path];
            }
            for (let i = 0; i < this.arts.length; i++) {
                let art = this.arts[i];
                if (art && typeof art.dispose === 'function') {
                    art.dispose();
                }
                delete this.arts[i];
            }
        }
        this.arts = [];
        this.paths = [];
    }
}

class FlowController{
	constructor(control) {
        if (fullDebug) ODS('FlowController - constructor')       
        this.parentElement = control.parent;
        this.control = control;
        this.scene = control.scene;
        this.camera = control.camera;
        
		this.objects = [];
		this.position = 0;
		this.lastPosition = 0;
		this.lastFrameTime = 0;
		this.target = 0;
		this._lastLeftMove = 0;
		this._lastRightMove = 0;
		this._lastRaycast = 0;
		this.enabled = true;
		this._mousedOverObject = null;
        
        this.SPACING = 1.5 * control.settings.spacingMultiplier;
        this.MIN_FRAME_TIME = (control.settings.capFramerate) ? MIN_FRAME_TIME*2 : MIN_FRAME_TIME;
		
        let defaultBackgroundColor;
        
		this.fastMoveEnabled = true;
		if (fullDebug) ODS('FlowController - Creating albumArts, DOMControls, DOMText');
        if (control.defaultStyles && control.defaultStyles.backgroundColor) {
            // split rgb(#,#,#) into [#,#,#]
            defaultBackgroundColor = control.defaultStyles.backgroundColor.split('(')[1].split(')')[0].split(',');
            // for custom-set background color
            let rgbArr;
            if (control.settings && control.settings.backgroundColor) rgbArr = control.settings.backgroundColor;
            else rgbArr = defaultBackgroundColor;
            
            if (rgbArr && rgbArr.length === 3) {
                this.albumArts = new AlbumArtController(rgbArr);
                // Set picture quality
                if (control.settings) this.albumArts.PICTURE_QUALITY = (control.settings.highResThumbnails == true) ? HIGH_PICTURE_QUALITY : LOW_PICTURE_QUALITY;
            }
            else throw new Error('Error parsing backgroundColor RGB values. Style is set to: ' + control.defaultStyles.backgroundColor)
        }
        else throw new Error('The defaultStyles object does not have backgroundColor defined');
        
        if (fullDebug) ODS('FlowController - created AAController');
		this.DOMControls = this._createDOMControls();
        this.DOMText = this._createDOMText();
        
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
		
		const noImage = this.albumArts.noImage;
		
		this.maxPosition = 100;
		if (fullDebug) ODS('FlowController - Creating geometry & material');
		this.geometry = new THREE.PlaneBufferGeometry(PICTURE_SIZE, PICTURE_SIZE, 1, 1);
		const gradientMaterial = new THREE.MeshBasicMaterial({
			map: this.albumArts.gradient, 
			opacity: 1,
			transparent: true,
		});
		
		if (fullDebug) ODS('FlowController - Creating objects');
		this.objects = [];
		for (var i = 0; i < TOTAL_GEOMETRIES; i++) {
			//Regular album
			let material = new THREE.MeshBasicMaterial({map: noImage, transparent: true,});
			let mesh =  new THREE.Mesh(this.geometry, material);
			//Reflection mesh
			let reflectionMesh = new THREE.Mesh(this.geometry, material);
            reflectionMesh.name = 'reflectionMesh';
			reflectionMesh.position.y = -1 * PICTURE_SIZE;
			//reflectionMesh.rotation.z = -1 * Math.PI;
			reflectionMesh.scale.y = -1;
			//Gradient (for reflection)
			let gradientMesh = new THREE.Mesh(this.geometry, gradientMaterial);
			gradientMesh.position.y = -1 * PICTURE_SIZE;
			
			let order = 'XYZ';
			mesh.rotation.reorder(order);
			reflectionMesh.rotation.reorder(order);
			gradientMesh.rotation.reorder(order);
			
            if (fullDebug) ODS('FlowController - object #'+i);
            if (!mesh) throw new Error('FlowController - Mesh not defined');
            if (!reflectionMesh) throw new Error('FlowController - reflectionMesh not defined');
            if (!gradientMesh) throw new Error('FlowController - gradientMesh not defined');
            
			let pos = i - NUM_ALBUMS_VISIBLE - 1;
			this.objects[i] = {
				mesh: mesh,
				reflectionMesh: reflectionMesh,
				gradientMesh: gradientMesh,
				position: pos,
				isMousedOver: false,
			}
			this.scene.add(mesh);
			this.scene.add(reflectionMesh);
			this.scene.add(gradientMesh);
		}
        
        this.handleSettingsChange = function() {
            var sett = this.control.settings;
            this.albumArts.PICTURE_QUALITY = (sett.highResThumbnails == true) ? HIGH_PICTURE_QUALITY : LOW_PICTURE_QUALITY;
            this.MIN_FRAME_TIME = (control.settings.capFramerate) ? MIN_FRAME_TIME*2 : MIN_FRAME_TIME;
            // Update the gradient map to the appropriate background color
            if (sett.backgroundColor) this.albumArts.changeGradient(sett.backgroundColor);
            else {
                if (control.defaultStyles) defaultBackgroundColor = control.defaultStyles.backgroundColor.split('(')[1].split(')')[0].split(',');
                this.albumArts.changeGradient(defaultBackgroundColor);
            }
            gradientMaterial.map = this.albumArts.gradient;
            this._updateCurrentAlbum(true);
        }.bind(this);
	}
	/**
	 * Animates the scene.
	 * @returns {boolean} Whether a frame was rendered.
	 */
	animate() {
		if (!this.enabled) return false;
        
        // this.control._setCornerBoxText(`target: ${this.target} Position: ${this.position} forceRefresh: ${this.forceRefresh}`);
        
        if (this.target > 0) this.target = 0;
        else if (this.target <= 0-this.maxPosition) this.target = 0-this.maxPosition + 1;
		
		const startTime = Date.now();
        
        let sett = this.control.settings;
        
		let diff = this.target - this.position;
        // Logic to determine whether to skip this frame
		if (diff === 0 && !this.forceRefresh && !this.albumArts.refreshFrameRequested && startTime - this.lastFrameTime < this.MIN_FRAME_TIME) return false;
		// if (diff === 0 && !this.forceRefresh && !this.albumArts.refreshFrameRequested &&
        //     ((startTime - this.lastFrameTime < this.MIN_FRAME_TIME && startTime - this.control._initializeTime > 3000) || 
        //     (startTime - this.lastFrameTime < MIN_FRAME_TIME_STARTUP)) // During first x seconds, use a lower min_frame_time
        //     ) return false;
        if (startTime - this.lastFrameTime < 1000/60 && this.control.settings.capFramerate) return false;
        
        this.albumArts.refreshFrameRequested = false;
        
		//manage velocity
		
		let velocity = 0;
		// Move to target, faster when target is farther away
		if (Math.abs(diff) > 0.001) {
			velocity = SCROLL_SPEED * (diff);
		}
		//if we are super close, just snap
		else
			this._snap();
        
        // Throttle carousel speed to prevent the thumbnails from disappearing
        let absV = Math.abs(velocity);
        if (absV > 18 && sett.throttleCarouselSpeed)
            velocity = (18 + Math.random()/2) * Math.sign(velocity);
		
		this._setPosition(this.position + velocity);
        
        let isMovingFast = Math.abs(velocity) > 0.5;
        let isMovingSlow = Math.abs(velocity) < 0.25;
        
        customPanel.update(velocity, 60);
        
        // If the carousel is moving fast, then clear the text from the current album
        if (isMovingFast && this.DOMText.currentAlbumIdx >= 0) {
            this.setDOMText({header: '', subheader: '', line1: '', line2: ''});
        }
        else {
            this._updateCurrentAlbum(undefined, !isMovingSlow);
        }
		
		//Update each object
		for (var i = 0; i < this.objects.length; i++) {
			let object = this.objects[i];
			
			//update album art for this item
			let idx = -1*this.position + object.position;
			let roundedIdx = Math.round(idx);
			if (idx - roundedIdx < 0.2) {
				let newArt = this.albumArts.getArt(roundedIdx, isMovingFast);
				if (object.mesh.material.map.uuid !== newArt) {
					object.mesh.material.map = newArt;
				}
                // If the art provided is the noImage art, then set it to transparent; otherwise make sure it's opaque
                // If all thumbnails enable transparency, then there will be graphical glitches
                object.mesh.material.transparent = (newArt === this.albumArts.noImage);
			}
			
			//hide if < 0 or > maximum
			if (roundedIdx >= this.maxPosition || roundedIdx < 0) {
				object.mesh.visible = false;
				object.reflectionMesh.visible = false;
				object.gradientMesh.visible = false;
			}
			else {
				object.mesh.visible = true;
				object.reflectionMesh.visible = true;
				object.gradientMesh.visible = true;
			}
			
			let p = object.position;
            let absP = Math.abs(p);
			// eased components for -1 < p < 1 (multiply the z)
			let q = (absP<1) ? (-0.5*(Math.cos(Math.PI*p))+0.5) : 1;		// angle
			let r = (absP<1) ? (Math.pow(p, 2)) : 1; 					// position
			let rotY = ( (p==0) ? 0 : ( (p>0) ? Math.PI/-4 : Math.PI/4 ) ) * q;
			let posX = p*this.SPACING + (p>0?1:-1)*(Math.min(absP,1)*2/* + Math.pow(0.3*absP, 2)*/);
			let posZ = -1*(Math.abs(q*3)) * r - 0.05*absP;               // z position; Slightly angled backward to ensure that the camera sees the objects layered correctly (to avoid transparency glitches)
			let showoffRot = (1 - q) * -0.25;									// x rotation for center album
			let showoffDiff = PICTURE_SIZE * Math.sin(showoffRot);
			let rotZ = showoffRot * rotY * 0.5; 								// to correct for double rotation
			
			//temp
			object.q = q; object.r = r;
			
			object.mesh.rotation.y = rotY;
			object.mesh.rotation.x = showoffRot;
			object.mesh.rotation.z = -1 * rotZ;
			object.mesh.position.x = posX;
			object.mesh.position.z = posZ;
			
			object.reflectionMesh.rotation.y = rotY;
			object.reflectionMesh.rotation.z = rotZ;
			object.reflectionMesh.position.x = posX;
			object.reflectionMesh.position.z = posZ - showoffDiff/2;
			object.reflectionMesh.position.y = -1*PICTURE_SIZE - showoffDiff/2 * 0.13 * (1 - q);
			
			object.gradientMesh.rotation.y = rotY;
			object.gradientMesh.rotation.z = rotZ;
			object.gradientMesh.position.x = posX;
			object.gradientMesh.position.z = posZ - showoffDiff/2 + 0.001;
			object.gradientMesh.position.y = -1*PICTURE_SIZE - showoffDiff/2 * 0.13 * (1 - q);
			
			object.position += this.position - this.lastPosition;
			//snap
			if (Number.isInteger(this.position)) 
                object.position = Math.round(object.position);
			
			//move object position to right if it's too far to the left
			if (object.position <= -1 * NUM_ALBUMS_VISIBLE - 2)
				object.position += TOTAL_GEOMETRIES;
			//move to left if too far to the right
			else if (object.position >= NUM_ALBUMS_VISIBLE + 2)
				object.position -= TOTAL_GEOMETRIES;
		}
        
        // Clear unfinished tasks
        let roundPosition = Math.round(-1*this.position);
        this.albumArts.flushUnfinishedTasks( roundPosition - NUM_ALBUMS_VISIBLE - 1, roundPosition + NUM_ALBUMS_VISIBLE + 1);
        
		const endTime = Date.now();
		
		//finally, set the lastPosition to the position at the end of this frame.
		this.lastPosition = this.position;
		this.lastFrameTime = endTime;
		
		return true;
	}
	_snap() {
		if (Math.abs(Math.round(this.position) - this.position) != 0) {
		} 
		this._setPosition(Math.round(this.position));
	}
	_setPosition(pos) {
		//this.lastPosition = this.position;
		this.position = pos;
	}
	_updateRaycast() {
		//Handle raycaster intersects
		this.raycaster.setFromCamera( this.mouse, this.camera );
		
		const intersects = this.raycaster.intersectObjects(this.scene.children);
		
		if (intersects.length == 0) this._mousedOverObject = null;
		else {
			//find the closest intersect
			let closestDistance = 1000;
			let closestObject = null;
			for (let i = 0; i < intersects.length; i++) {
				let intersect = intersects[i];
				if (intersect.distance < closestDistance) {
					closestDistance = intersect.distance;
					closestObject = intersect.object;
				}
			}
			//find which object it is
            for (let i = 0; i < this.objects.length; i++) {
                let object = this.objects[i];
				if (object.mesh === closestObject && object.mesh.visible) {
					object.isMousedOver = true;
					this._mousedOverObject = object;
				}
				else {
					object.isMousedOver = false;
				}
			}
		}
	}
    // Do not directly reference _seekMouseMove; instead, use _seekHandler (which is binded to this object)
    _seekMouseMove(e) {
        let x = e.clientX;
        let rect = this.DOMControls.DOMRect;
        let barWidth = this.DOMControls.barWidth/2;
        let barPadding = this.DOMControls.barPadding;
        
        let barLeft;
        let position;
        let maxPosition = this.maxPosition - 1;
        
        // too far to the left
        if (x < rect.left + barWidth + barPadding) {
            barLeft = barPadding;
            position = 0;
        }
        // too far to the right
        else if (x > rect.width + rect.left - barWidth - barPadding) {
            barLeft = rect.width - barWidth*2 - barPadding;
            position = maxPosition;
        }
        // inside bounds
        else {
            barLeft = Math.floor(x - rect.left - barWidth);
            position = Math.round((maxPosition) * (x - rect.left - barWidth) / (rect.width - barWidth*2));
        }
        
        this.target = -1 * position;
        
        this.DOMControls.barDrag.style.left = barLeft + 'px';
    }
    // used whenever target is modified by another source
    _updateBarPosition() {
        let rect = this.DOMControls.DOMRect;
        let barWidth = this.DOMControls.barWidth/2;
        let barPadding = this.DOMControls.barPadding;
        let maxPosition = this.maxPosition - 1;
        
        //make sure target is within bounds
        if (this.target > 0) this.target = 0;
        else if (this.target <= 0-this.maxPosition) this.target = 0-this.maxPosition + 1;
        
        //update bar position
        let barLeft = Math.round( (1 - (this.target - -1*maxPosition) / maxPosition) * (rect.width - barWidth*2 - barPadding*2) + barPadding);
        
        this.DOMControls.barDrag.style.left = barLeft + 'px';
    }
    _seekStart(e) {
        document.addEventListener('mousemove', this._seekHandler);
        // Handle the click event as well, to update the bar position without having to move the mouse
        this._seekHandler(e);
    }
    _seekEnd() {
        document.removeEventListener('mousemove', this._seekHandler);
    }
    disableDOMControls () {
        this.DOMControls.barContainer.style.display = 'none';
    }
	_createDOMControls() {
		let barContainer = document.createElement('div');
		let barParent = document.createElement('div');
		let bar = document.createElement('div');
		let barDrag = document.createElement('div');
		let arrowLeft = document.createElement('div');
		let arrowRight = document.createElement('div');
		
		barContainer.classList.add('threeDView-seekBarContainer');
		barParent.classList.add('threeDView-seekBarParent');
		bar.classList.add('threeDView-seekBar');
		barDrag.classList.add('threeDView-seekBar-drag');
		arrowLeft.classList.add('threeDView-seekBar-arrowLeft');
		arrowRight.classList.add('threeDView-seekBar-arrowRight');
		
		barContainer.appendChild(barParent);
		barParent.appendChild(arrowLeft);
		barParent.appendChild(arrowRight);
		barParent.appendChild(bar);
		bar.appendChild(barDrag);
		this.parentElement.appendChild(barContainer);
        
        this._seekHandler = this._seekMouseMove.bind(this);
        
        localListen(bar, 'mousedown', (e) => {
            this._seekStart(e);
        });
        app.listen(document.body, 'mouseup', () => {
            this._seekEnd();
        });
        app.listen(window, 'blur', () => {
            this._seekEnd();
        });
        localListen(app.player, 'playbackState', (newState) => {
            if (newState === 'trackChanged') {
                this._updateCurrentAlbum(true);
            }
        })
        localListen(arrowLeft, 'mousedown', () => {
            this.moveRight();
        });
        localListen(arrowRight, 'mousedown', () => {
            this.moveLeft();
        });
		
		return {
			barContainer: barContainer,
			barParent: barParent,
			bar: bar,
			barDrag: barDrag,
			arrowLeft: arrowLeft,
			arrowRight: arrowRight,
            DOMRect: bar.getBoundingClientRect(),
            barWidth: 40,
            barPadding: 2
		}
	}
    _createDOMText() {
		let textContainer = document.createElement('div'),
            textHeader = document.createElement('div'),
            textSubheader = document.createElement('div'),
            textLine1 = document.createElement('div'),
            textLine2 = document.createElement('div'),
            br1 = document.createElement('br'),
            br2 = document.createElement('br'),
            br3 = document.createElement('br');
        
		textContainer.classList.add('threeDView-textContainer');
		textContainer.classList.add('threeDView-textShadowEnabled');
		textHeader.classList.add('threeDView-textHeader');
		textSubheader.classList.add('threeDView-textSubheader');
		textLine1.classList.add('threeDView-textLine1');
		textLine2.classList.add('threeDView-textLine2');
        
        textContainer.appendChild(textHeader);
        textContainer.appendChild(br1);
        textContainer.appendChild(textSubheader);
        textContainer.appendChild(br2);
        textContainer.appendChild(textLine1);
        textContainer.appendChild(br3);
        textContainer.appendChild(textLine2);
        this.parentElement.appendChild(textContainer);
        
        let _this = this;
        
        return {
            textContainer: textContainer, 
            textHeader: textHeader,
            textSubheader: textSubheader,
            textLine1: textLine1, 
            textLine2: textLine2,
            currentAlbumIdx: -1,
            hotlinkActions: {
                album: {
                    label: 'Album',
                    execute: () => {
                        if (_this.dataSource) {
                            _this.dataSource.locked(() => {
                                let album = this.dataSource.getValue(_this.DOMText.currentAlbumIdx);
                                if (album) navigationHandlers.album.navigate(album);
                            });
                        }
                    }
                },
                year: {
                    label: 'Year',
                    execute: () => {
                        if (_this.dataSource) {
                            _this.dataSource.locked(() => {
                                let album = this.dataSource.getValue(_this.DOMText.currentAlbumIdx);
                                if (album) navigationHandlers.year.navigate(album);
                            });
                        }
                    }
                },
                albumartist: {
                    label: 'Album Artist',
                    execute: () => {
                        if (_this.dataSource) {
                            _this.dataSource.locked(() => {
                                let album = this.dataSource.getValue(_this.DOMText.currentAlbumIdx);
                                if (album) navigationHandlers.albumartist.navigate(album.albumArtist);
                            });
                        }
                    }
                },
            },
            // DOMRect: textContainer.getBoundingClientRect(),
        }
    }
    /**
     * 
     * @param {boolean} force 
     * @param {boolean} skipUpdatingTracklist If set to true, do not update tracklist [this is for when the carousel is moving slower than the threshold for text but too fast for tracklist update]
     */
    _updateCurrentAlbum(force) {
        const _this = this;
        
        // Set DOM text of the current album if needed
        let idx = parseInt(-1*this.target);
        if (this.dataSource) {
            if (idx != this.DOMText.currentAlbumIdx || force === true) {
                let sett = this.control.settings;
                let hotlinks = this.DOMText.hotlinkActions;
                
                // Get current album and set the text
                this.dataSource.locked(async () => {
                    let album = this.dataSource.getValue(idx);
                    
                    if (!album) return;
                    // don't await tracklist unless we need to
                    var needToAwaitTracklist = false;
                    for (let prop in sett.textFields) if (sett.textFields[prop] === 'count' || sett.textFields[prop] === 'trackTitle') needToAwaitTracklist = true;
                    if (this.control.needsTracklist) needToAwaitTracklist = true;
                    
                    let tracklist = album.getTracklist();
                    
                    for (let prop in sett.textHotlinks)
                        if (sett.textHotlinks[prop] && !this.DOMText.hotlinkActions.hasOwnProperty(sett.textHotlinks[prop]))
                            throw new Error(`DOMText.hotlinkActions does not have property ${sett.textHotlinks[prop]} (settings.textHotlinks.${prop})`);
                    
                    if (needToAwaitTracklist) {
                        await tracklist.whenLoaded(); // to get track count
                        var trackString = makeTrackString(tracklist.count);
                        var trackTitleString = makeTrackTitleString(tracklist);
                    } 
                    
                    let header = makeString(sett.textFields.header);
                    let subheader = makeString(sett.textFields.subheader);
                    let line1 = makeString(sett.textFields.line1);
                    let line2 = makeString(sett.textFields.line2);
                    let headerLink = hotlinks.hasOwnProperty(sett.textHotlinks.header) ? hotlinks[sett.textHotlinks.header] : null;
                    let subheaderLink = hotlinks.hasOwnProperty(sett.textHotlinks.subheader) ? hotlinks[sett.textHotlinks.subheader] : null;
                    let line1link = hotlinks.hasOwnProperty(sett.textHotlinks.line1) ? hotlinks[sett.textHotlinks.line1] : null;
                    let line2link = hotlinks.hasOwnProperty(sett.textHotlinks.line2) ? hotlinks[sett.textHotlinks.line2] : null;
                    
                    if (typeof header === 'number' && header === -1) header = '';
                    if (typeof subheader === 'number' && subheader === -1) subheader = '';
                    if (typeof line1 === 'number' && line1 === -1) line1 = '';
                    if (typeof line2 === 'number' && line2 === -1) line2 = '';
                    
                    this.setDOMText({
                        header: header,
                        subheader: subheader,
                        line1: line1,
                        line2: line2
                    }, {
                        header: headerLink,
                        subheader: subheaderLink,
                        line1: line1link,
                        line2: line2link,
                    });
                    
                    // now update the data source of the tracklist (needed for FlowAlbumView.getTracklist)
					if (this.control.needsTracklist && this.control.parentView.viewNode.handlerID === 'playlist') {
						// For playlists, we have to filter the tracklist
						let filteredTracklist = await this.filterFromPlaylist(tracklist);
						this.control.focusedTracklist = filteredTracklist;
					}
					else {
						this.control.focusedTracklist = tracklist;
					}
                    
                    function makeString(textField) {
                        if (album[textField] === -1 || !textField) return '';
                        
                        let str = '';
                        if (_this.control.settings.showPrefix && uitools.tracklistFieldDefs[textField]) 
                            str = uitools.tracklistFieldDefs[textField].title + ': ';
                        str +=  (textField === 'count') ? trackString :
                                (textField === 'trackTitle') ? trackTitleString :
                                album[textField];
                        return str;
                    }
                    
                    function makeTrackTitleString(tracklist) {
                        let track = app.player.getCurrentTrack();                        
                        if (typeof tracklist.getAllValues !== 'function') return '[Not supported, please update to at least 5.0.2]';
                        let paths = tracklist.getAllValues('path');
                        // if the album includes the current track, then print its title
                        if (track && paths.includes(track.path)) {
                            return track.title;
                        }
                        else return '';
                    }
                    
                    function makeTrackString(count) {
                        if (count == 1) return `${count} track`;
                        else return `${count} tracks`;
                    }
                });
                this.DOMText.currentAlbumIdx = idx;
            }
        }
    }
    // Filter a tracklist based on the playlist contents (this is only for when the current view node is a playlist)
    async filterFromPlaylist(tracklist) {
        var filteredTracklist = app.utils.createTracklist();
        let tracklistIDs = await this.control.tracklistIDs;
        if (tracklistIDs) {
            // Go through the tracklist, and if it's included in the playlist array, add it to the filteredTracklist
            tracklist.locked(() => {
                for (let i = 0; i < tracklist.count; i++) {
                    let song;
                    song = tracklist.getFastObject(i, song);
                    let idx = tracklistIDs.indexOf(song.idsong);
                    if (idx > -1) {
                        song.playlistSongOrder = idx + 1;
                        filteredTracklist.add(song);
                    }
                }
            });
        }
        return filteredTracklist;
    }
    /**
     * @param {Object} contents 
     * @param {string} [contents.header] Header
     * @param {string} [contents.subheader] Subheader
     * @param {string} [contents.line1] Line 1
     * @param {string} [contents.line2] Line 2
     * @param {Object} [hotlinkActions] Hotlink actions (use functions from this.DOMControls.hotlinkActions)
     */
    setDOMText(contents, hotlinkActions) {
        // Set the text
        this.DOMText.textHeader.innerText = contents.header || '';
        this.DOMText.textSubheader.innerText = contents.subheader || '';
        this.DOMText.textLine1.innerText = contents.line1 || '';
        this.DOMText.textLine2.innerText = contents.line2 || '';
        
        // Set the hotlink actions
        if (!hotlinkActions) hotlinkActions = {};
        // Header
        if (hotlinkActions.header && typeof hotlinkActions.header.execute === 'function') {
            this.DOMText.textHeader.onclick = hotlinkActions.header.execute;
            this.DOMText.textHeader.classList.add('threeDView-hotlink');
        }
        else {
            this.DOMText.textHeader.onclick = null;
            this.DOMText.textHeader.classList.remove('threeDView-hotlink');
        }
        // Subheader
        if (hotlinkActions.subheader && typeof hotlinkActions.subheader.execute === 'function') {
            this.DOMText.textSubheader.onclick = hotlinkActions.subheader.execute;
            this.DOMText.textSubheader.classList.add('threeDView-hotlink');
        }
        else {
            this.DOMText.textSubheader.onclick = null;
            this.DOMText.textSubheader.classList.remove('threeDView-hotlink');
        }
        // Line 1
        if (hotlinkActions.line1 && typeof hotlinkActions.line1.execute === 'function') {
            this.DOMText.textLine1.onclick = hotlinkActions.line1.execute;
            this.DOMText.textLine1.classList.add('threeDView-hotlink');
        }
        else {
            this.DOMText.textLine1.onclick = null;
            this.DOMText.textLine1.classList.remove('threeDView-hotlink');
        }
        // Line 2
        if (hotlinkActions.line2 && typeof hotlinkActions.line2.execute === 'function') {
            this.DOMText.textLine2.onclick = hotlinkActions.line2.execute;
            this.DOMText.textLine2.classList.add('threeDView-hotlink');
        }
        else {
            this.DOMText.textLine2.onclick = null;
            this.DOMText.textLine2.classList.remove('threeDView-hotlink');
        }
    }
    setDataSource(newDataSource) {
        // newDataSource.whenLoaded()
        this.control.dataSourceReady // make sure to wait until sort is done
        .then(() => {
            this.dataSource = newDataSource;
            this._dataSource = newDataSource; // _dataSource is the un-filtered data source
            this.albumArts.setDataSource(newDataSource);
            // update max position
            if (newDataSource.count > 0)
                this.maxPosition = newDataSource.count; 
            // if there are no albums, keep a total of 1
            else 
                this.maxPosition = 1;
            // Force DOM text to update
            this.DOMText.currentAlbumIdx = -1;
        })
    }
    async scrollToLetter(letter) {
        if (this.dataSource) {
            let filteredDS = await this.dataSource.filterByPrefix(letter).whenLoaded();
            if (filteredDS.count > 0) {
                filteredDS.locked(() => {
                    this.dataSource.locked(() => {
                        let firstAlbum = filteredDS.getValue(0);
                        let idx = this.dataSource.indexOf(firstAlbum);
                        
                        this.target = -1 * idx;
                    });
                });
            }
        }
    }
    async filterAlbums(searchPhrase) {
        if (this.dataSource && this._dataSource) {
            this.dataSource = await this._dataSource.filterBySearchPhrase(searchPhrase).whenLoaded();
            
            if (this.dataSource.count === 0) {
                this.control.showToast(`"${searchPhrase}": ${_('phrase not found')}`);
                this.resetFilter();
            };
            
            // Update the arts data source, update max position, and update current album text
            this.albumArts.setDataSource(this.dataSource);
            this.maxPosition = this.dataSource.count;
            this._updateCurrentAlbum(true);
            
            // For a short period (a few frames), enable a force refresh, to force the controller to render extra frames
            //  This is so that the album art does not take a half-second to appear while filtering
            this.control.triggerTemporaryForcedFrames();
        }
    }
    async resetFilter() {
        if (this.dataSource && this._dataSource) {
            // Clear the filtered data sources, and temporarily force refresh just like in filterAlbums
            this.dataSource = this._dataSource;
            // Update the arts data source, update max position, and update current album text
            this.albumArts.setDataSource(this.dataSource);
            this.maxPosition = this.dataSource.count;
            this._updateCurrentAlbum(true);
            
            this.control.triggerTemporaryForcedFrames();
        }
    }
    /**
     * Update the bounding client rect of the DOM controls.
     */
    updateDOMControlSize() {
        this.DOMControls.DOMRect = this.DOMControls.bar.getBoundingClientRect();
    }
    updateTextSize(parentHeight) {
        // Update the class of the text container, which will change the size of the text.
        if (parentHeight < 450) {
            this.DOMText.textContainer.classList.add('threeDView-xsmall');
            this.DOMText.textContainer.classList.remove('threeDView-small');
            this.DOMText.textContainer.classList.remove('threeDView-medium');
        }
        else if (parentHeight < 600) {
            this.DOMText.textContainer.classList.add('threeDView-small');
            this.DOMText.textContainer.classList.remove('threeDView-xsmall');
            this.DOMText.textContainer.classList.remove('threeDView-medium');
        }
        else if (parentHeight < 900) {
            this.DOMText.textContainer.classList.add('threeDView-medium');
            this.DOMText.textContainer.classList.remove('threeDView-xsmall');
            this.DOMText.textContainer.classList.remove('threeDView-small');
        }
        else {
            this.DOMText.textContainer.classList.remove('threeDView-medium');
            this.DOMText.textContainer.classList.remove('threeDView-xsmall');
            this.DOMText.textContainer.classList.remove('threeDView-small');
        }
    }
    preloadThumbnails() {
        const _this = this;
        _this.cancelThumbnailLoading = false;
		
		var taskProgress = app.backgroundTasks.createNew();
		taskProgress.leadingText = ('Preloading thumbnails: ');
		
		var count = (_this.dataSource) ? _this.dataSource.count : 0;
        
        _this.albumArts.isPreloadingAA = true;
        
        function _loadByIdx(idx) {
            if (window._cleanUpCalled || _this._cleanUpCalled) return taskProgress.terminate();
            
            if (_this.cancelThumbnailLoading || (idx > count) || taskProgress.terminated) {
                _this.albumArts.isPreloadingAA = false;
                return taskProgress.terminate();
            }
			
			_this.albumArts.getArt(idx, false, true);
			_this.albumArts.getArt(idx + 1, false, true);
            _this.albumArts.getArt(idx + 2, false, true, (done) => {
					
				taskProgress.text = sprintf('%d of %d', idx + 2, count);
				taskProgress.value = (idx + 2) / count;
				
				// Give the system some time to breathe
				setTimeout(() => {
					_loadByIdx(idx + 3);
				}, 1);
            })
        }
        _loadByIdx(0);
    }
	moveLeft() {
		
		if (this.target > -1*this.maxPosition+1) {
			this.target--;
			
			// if the key event is happening fast enough, give it a bigger kick (increment target 2x as much)
			let now = Date.now();
			if (now - this._lastLeftMove < FAST_MOVE_THRESHOLD && this.target > -1*this.maxPosition+2 && this.fastMoveEnabled) {
				this.target--;
			}
			this._lastLeftMove = now;
            
            this._updateBarPosition();
		}
	}
	moveRight() {
		
		if (this.target < 0) {
			this.target++;
			
			// if the key event is happening fast enough, give it a bigger kick (increment target 2x as much)
			let now = Date.now();
			if (now - this._lastRightMove < FAST_MOVE_THRESHOLD && this.target < 1 && this.fastMoveEnabled) {
				this.target++;
			}
			this._lastRightMove = now;
            
            this._updateBarPosition();
		}
	}
	/**
	 * @param {MouseEvent} e 
	 */
	onMouseDown(e) {
		this._updateRaycast();
		//Set the target to the clicked object
		if (this._mousedOverObject && this._mousedOverObject.mesh.visible) {
			
			this.target = Math.round(this.position - this._mousedOverObject.position);
			this._updateBarPosition();
			
			let ds = this.dataSource;
			let index = parseInt(-1*this.target);
			if (ds && ds.count > 0) {
				
				ds.modifyAsync(function () {
					ds.clearSelection();
					ds.setSelected(index, true);
					ds.focusedIndex = index;
				});
			}
		}
	}
    onMouseWheel(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Default to deltaY, but if it's a horizontal scroll i.e. deltaY is 0, then use deltaX
        let origDelta = e.deltaY;
        if (e.deltaY === 0) origDelta = e.deltaX;
        
        let sett = this.control.settings;
        let delta;
        // For user-set scroll # to override the Windows setting
        if (sett.mouseWheelScrollNumber) {
            delta = -1 * Math.sign(origDelta) * sett.mouseWheelScrollNumber;
        }
        // By default, scroll the # of lines that Windows sets (for this purpose, the offset must be 0.024 times the delta)
        else {
            delta = -1 * origDelta * 0.024;
        }
        
        delta = (delta > 0) ? Math.ceil(delta) : Math.floor(delta);
        
        this.target += delta;
        this._updateBarPosition();
    }
	cleanUp() {
        this._cleanUpCalled = true;
		
        for (let i = 0; i < this.objects.length; i++) {
            let object = this.objects[i];
			this.scene.remove(object.gradientMesh);
			this.scene.remove(object.mesh);
			this.scene.remove(object.reflectionMesh);
			disposeNode(object.gradientMesh);
			disposeNode(object.mesh);
			disposeNode(object.reflectionMesh);
		}
		
		this.albumArts.cleanUp();
		        
        // for any remaining children like lights
        for (let child of this.scene.children) {
            this.scene.remove(child);
            if (typeof child.dispose === 'function')
                child.dispose();
        }
        
		this.enabled = false;
		
		this.scene = null;
		this.camera = null;
		this.albumArts = null;
	}
}

function disposeNode (node)
{
    if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
        }

        if (node.material)
        {
            if (node.material instanceof THREE.MeshFaceMaterial)
            {
                $.each (node.material.materials, function (idx, mtrl)
                {
                    if (mtrl.map)               mtrl.map.dispose ();
                    if (mtrl.lightMap)          mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap)           mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap)         mtrl.normalMap.dispose ();
                    if (mtrl.specularMap)       mtrl.specularMap.dispose ();
                    if (mtrl.envMap)            mtrl.envMap.dispose ();
                    if (mtrl.alphaMap)          mtrl.alphaMap.dispose();
                    if (mtrl.aoMap)             mtrl.aoMap.dispose();
                    if (mtrl.displacementMap)   mtrl.displacementMap.dispose();
                    if (mtrl.emissiveMap)       mtrl.emissiveMap.dispose();
                    if (mtrl.gradientMap)       mtrl.gradientMap.dispose();
                    if (mtrl.metalnessMap)      mtrl.metalnessMap.dispose();
                    if (mtrl.roughnessMap)      mtrl.roughnessMap.dispose();

                    mtrl.dispose ();    // disposes any programs associated with the material
                });
            }
            else
            {
                if (node.material.map)              node.material.map.dispose ();
                if (node.material.lightMap)         node.material.lightMap.dispose ();
                if (node.material.bumpMap)          node.material.bumpMap.dispose ();
                if (node.material.normalMap)        node.material.normalMap.dispose ();
                if (node.material.specularMap)      node.material.specularMap.dispose ();
                if (node.material.envMap)           node.material.envMap.dispose ();
                if (node.material.alphaMap)         node.material.alphaMap.dispose();
                if (node.material.aoMap)            node.material.aoMap.dispose();
                if (node.material.displacementMap)  node.material.displacementMap.dispose();
                if (node.material.emissiveMap)      node.material.emissiveMap.dispose();
                if (node.material.gradientMap)      node.material.gradientMap.dispose();
                if (node.material.metalnessMap)     node.material.metalnessMap.dispose();
                if (node.material.roughnessMap)     node.material.roughnessMap.dispose();

                node.material.dispose ();   // disposes any programs associated with the material
            }
        }
    }
}

window.FlowController = FlowController;
window.AlbumArtController = AlbumArtController;