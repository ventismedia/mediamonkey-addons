import PlayingListContainer from "mediamonkey/controls/playingListContainer";
// Keep track of the state that's restored to the control on the main window, so we don't have to go through recursive state-restoring on the sub dialog
var stateRestore;
PlayingListContainer.prototype.override({
    restoreState: function ($super, state) {
        $super(state);
        stateRestore = state;
    },
    insertListControl: function ($super) {
        // insertListControl is called when the playing list setting is changed
        $super();
        stateRestore = this.storeState();
    }
});

// Override the undockPlaying execute to access the local stateRestore variable
actions._undockPlaying.execute = () => {
    uitools.openDialog('dlgUndockedControl', {
        modal: false,
        control: 'PlayingListContainer',
        stateRestore: stateRestore,
        // notShared: true,
    });
}

window.playingListMenuItems.push({
    order: 10,
    grouporder: 999,
    action: {
        title: 'Undock',
        icon: 'mode_windowed',
        execute: actions.undockPlaying.execute,
        visible: window.isMainWindow
    }
});

window.playingListMenuItems.push({
    order: 20,
    grouporder: 999,
    action: {
        title: 'Close',
        icon: 'close',
        execute: function () {
            closeWindow();
        },
        visible: !window.isMainWindow
    }
});