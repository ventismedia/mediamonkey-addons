import 'mediamonkey-types/controls/menuButton';
import 'mediamonkey-types/controls/columnTracklist';
import 'mediamonkey-types/controls/nowplayingList';
import 'mediamonkey-types/controls/nowPlaying/tracklist';
import 'mediamonkey-types/controls/PlaylistHeader';
import 'mediamonkey-types/viewHandlers';
import 'mediamonkey-types/controls/playingListContainer';
import Multiview from 'mediamonkey-types/controls/multiview';
import type { Control, LyricsWindow } from 'mediamonkey-types/types/Controls';

declare global {
    var undocked_control: any; // todo correct type
}

export function init(this: Window, params) {
    window.undocked_control = params.control; // a way to identify inside actions.js which dialog to close when toggling with keyboard shortcut

    const wnd = this;
    const UI = getAllUIElements<{
        customControl: ElementWith<LyricsWindow | Multiview>,
        contentContainer: HTMLElement,
        parent: ElementWith<Control>,
    }>();

    UI.customControl.setAttribute('data-control-class', params.control);
    initializeControls(UI.parent);

    // Issue restoreState if a state is provided
    if (params.stateRestore) {
        UI.customControl.controlClass.restoreState(params.stateRestore);
    }
    if (params.viewData && params.control === 'Multiview') {
        assert(UI.customControl.controlClass instanceof Multiview);
        nodeUtils.initLoadProgress(params.viewData.viewNode);
        UI.customControl.controlClass.showView(params.viewData);
    }

    switch (params.control) {
        case 'PlayingListContainer':
            wnd.title = _('Playing');
            break;
        case 'LyricsWindow':
            wnd.title = _('Lyrics');
            break;
        case 'Multiview':
            assert(UI.customControl.controlClass instanceof Multiview);
            if (params.viewData) UI.customControl.controlClass.showView(params.viewData);
            if (params.playlist) wnd.title = _('Playlist') + ': ' + params.playlist.title;
            break;
        default:
            wnd.title = '';
    }
    wnd.resizeable = true;

    localListen(app, 'hotkey', hotkeyHandler); // unlistened via window.cleanupDocument

    app.listen(thisWindow, 'closeQuery', function (token) {
        let mainWnd = app.dialogs.getMainWindow();
        let actions = mainWnd.getValue('actions');
        // If we're closing, notify the main window by running the associated action with toggling the undocked control
        //  If all goes well, this will only execute when the X button is pressed, and it'll just set isXUndocked to false
        if (actions) {
            switch (window.undocked_control) {
                case 'LyricsWindow':
                    actions.undockLyrics.execute(true);
                    break;
                case 'PlayingListContainer':
                    actions.undockPlaying.execute(true);
                    break;
            }
        }
        window.undocked_control = null;
        token.resolved();
    });

}

function hotkeyHandler(h) {
    if (app.hotkeys.getEditMode() == true) return; // hotkeys are being edited, do not hit the action right now

    // Unfortunately, the global attribute is always true inside a dialog, so we have to handle both manually.
    var HD = hotkeys.getHotkeyData(h.hotkey, true) || hotkeys.getHotkeyData(h.hotkey, false);
    if (HD) {
        // Only run the actions associated with this addon
        switch (HD.action) {
            case 'undockLyrics':
                // only run action if it's on the right window (e.g. don't run undockPlaying if this window is lyrics)
                if (window.undocked_control === 'LyricsWindow')
                    actions.undockLyrics.execute(true);
                break;
            case 'undockPlaying':
                if (window.undocked_control === 'PlayingListContainer')
                    actions.undockPlaying.execute(true);
                break;
        }
    }
}