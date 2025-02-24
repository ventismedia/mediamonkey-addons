"use strict";
import FlowAlbumView from "./FlowAlbumView";

// inheritClass('ArtistFlowAlbumView', FlowAlbumView, {
export default class ArtistFlowAlbumView extends FlowAlbumView {
    albumsTitle: HTMLDivElement;
    initialize (elem, params) {
        // Title (before the album view)
        var albumsTitleParent = document.createElement('div');
        albumsTitleParent.innerHTML = '<h3 data-id="albumsTitle" class="inline blockTitleMarginFirst">Albums</h3>';
        this.albumsTitle = qeid(albumsTitleParent, 'albumsTitle');
        elem.appendChild(albumsTitleParent);
        
        this.isArtistView = true;
        
        super.initialize(elem, params);
        
        elem.classList.remove('fill');
        elem.classList.add('threeDView-artistViewParent');
        this.parent.classList.add('threeDView-artistView');
        
        // If an albumSortByControl exists in the current screen, then use it to determine autoSortString
        const albumSortByControl = qeid(currentTabControl.container, 'albumSortByControl');
        if (albumSortByControl && albumSortByControl.controlClass && albumSortByControl.controlClass.sortString) {
            this.autoSortString = albumSortByControl.controlClass.sortString;
            this.localListen(albumSortByControl, 'change', () => {
                this.autoSortString = albumSortByControl.controlClass.sortString;
            })
        }
    }
    setAlbumsTitle  (cnt) {
        if (this.albumsTitle) {
            var t = _('Albums');
            if ((cnt !== undefined) && (cnt >= 5)) {
                t += ' (' + cnt + ')';
            }
            this.albumsTitle.textContent = t;
        }
    }
    async filterSource(searchPhrase) {
        // If the search phrase is empty, un-filter the albums
        if (!searchPhrase || searchPhrase == '' || searchPhrase == ' ') {
            this.controller.resetFilter();
            return;
        }
        this.controller.filterAlbums(searchPhrase).then(() => {
            this.setAlbumsTitle(this.dataSource.count);
        });
    }
    _setCameraPosition() {
        var ratio = this.camera.aspect;
        
        if (this.settings.disablePerspectiveDistortion) {
            this.camera.position.y = 2;
            this.camera.position.z = 7.5;
        }
        else {
            this.camera.position.y = 3.4;
            this.camera.position.z = 7.5;
        }
        
        // Update the camera's fov and angle, and album spacing, depending on the view's aspect ratio
        if (ratio > 2.5) {
            let ratioDiff = ratio - 2.5;
            this.controller.SPACING = Math.min(1.5 + ratioDiff / 2.2, 3.1) * 2;
            this.camera.fov = Math.max(50 - ratioDiff * 4.5, 30);
            this.camera.lookAt(0, Math.min(-0.5 + ratioDiff / 5, 0.075), 0);
        }
        else {
            this.controller.SPACING = 1.5 * 2;
            this.camera.fov = 50;
            this.camera.lookAt(0, -0.5, 0);
        }
    }
    get dataSource() {
        return super.dataSource;
    }
    set dataSource(ds) {
        super.dataSource = ds;
        ds.whenLoaded()
            .then(() => {
                this.setAlbumsTitle(ds.count);
            })
    }
}

registerClass(ArtistFlowAlbumView);
registerFileImport('controls/ArtistFlowAlbumView');