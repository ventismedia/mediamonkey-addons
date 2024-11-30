import PlaylistHeader from "mediamonkey-types/controls/playlistHeader"
PlaylistHeader.prototype.override({
    _initButtons: function($super) {
        $super();
        const _this = this;
        // Main window: Undock
        if (isMainWindow) {
            this.btnMenu.controlClass.menuArray.push({
                action: bindAction(window.actions.undockPlaylist, () => _this.parentView.viewNode),
                order: 10,
                grouporder: 0
            });
        }
        // Not main window: Close
        else {
            this.btnMenu.controlClass.menuArray.push({
                action: actions.closeUndockedWindow,
                order: 10,
                grouporder: 0
            });
        }
    }
})