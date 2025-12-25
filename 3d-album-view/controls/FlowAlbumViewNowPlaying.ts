"use strict";
import FlowAlbumView from "./FlowAlbumView";

export default class FlowAlbumViewNowPlaying extends FlowAlbumView {
    handlePlaybackStateChange: (this: FlowAlbumViewNowPlaying, e: string) => void;
    initialize (elem, params) {
        super.initialize(elem, params);
		
		this.doubleClickDisabled = true; // disable double click
		this.contextMenu = () => {};
        
        var currentTrack;
        var lastPSCTime;
        this.handlePlaybackStateChange = (function(this: FlowAlbumViewNowPlaying, e: string) {
            if (e === 'trackChanged' || e === 'play' || e === 'unpause') {
                // Don't allow multiple event handlers in the same few frames
                var now = Date.now();
                if (now - lastPSCTime < 100) return;
                lastPSCTime = now;
                
                if (this.controller && this.dataSource) {
                    this.dataSource.locked(async () => {
                        currentTrack = app.player.getFastCurrentTrack(currentTrack);
                        if (!currentTrack) return;
                        
                        var currentAlbum = await currentTrack.getAlbumAsync();
                        if (!currentAlbum) return;
                        
                        var idx = await this.dataSource.indexOfPersistentIDAsync(currentAlbum.persistentID);
                        if (idx < 0) return console.error('Current album not found in album list!'); // to remove later
                        
                        this.controller.target = -1 * idx;
                    });
                }
                else {
                    console.error(`Couldn't handle playback state change. ${this.controller} ${this.dataSource}`);
                }
            }
        }).bind(this);
        
        app.listen(app.player, 'playbackState', this.handlePlaybackStateChange);
        
        if (this.controller) {
            this.controller.disableDOMControls();
        }
    }
    cleanUp() {
        super.cleanUp();
        
        app.unlisten(app.player, 'playbackState', this.handlePlaybackStateChange);
    }
}

registerClass(FlowAlbumViewNowPlaying);
registerFileImport('controls/flowAlbumView');