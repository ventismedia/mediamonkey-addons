import { ExecutableAction } from "mediamonkey-types/actions";
import { openDialog } from "mediamonkey-types/uitools";

declare module 'mediamonkey-types/actions' {
    interface Actions {
        undockLyrics: ExecutableAction;
        undockPlaying: ExecutableAction;
        _undockPlaying: ExecutableAction;
        closeUndockedWindow: ExecutableAction;
        undockPlaylist: ExecutableAction;
    }
}

(() => {
    
    var isLyricsUndocked = false, 
        isPlayingUndocked = false;
    
    actions.undockLyrics = {
        title: _('Undock') + ': ' + _('Lyrics'),
        icon: 'mode_windowed',
        hotkeyAble: true,
        category: actionCategories.window,
        execute: (fromDialog) => {
            // Only do undock if I'm the main window
            if (isMainWindow) {
                // Sanity check: If fromDialog, JUST set undocked to false and do nothing
                if (fromDialog === true) {
                    isLyricsUndocked = false;
                    return;
                }
                if (isLyricsUndocked) {
                    // If I'm the main window & lyrics is undocked, assume that the sub dialog has handled the event properly
                    isLyricsUndocked = false;
                }
                else {
                    // Perform the undock.
                    uitools.openDialog('dlgUndockedControl', {
                        modal: false,
                        control: 'LyricsWindow',
                        // notShared: true, // required at the moment to use a module script
                    });
                    isLyricsUndocked = true;
                }
            }
            // if I'm a sub dialog, close myself
            else {
                actions.closeUndockedWindow.execute();
            }
        }
    };

    actions.undockPlaying = {
        title: _('Undock') + ': ' + _('Playing'),
        icon: 'mode_windowed',
        hotkeyAble: true,
        category: actionCategories.window,
        execute: (fromDialog) => {
            // Logic is the same as undockLyrics. See comments above.
            if (isMainWindow) {
                if (fromDialog === true) {
                    isPlayingUndocked = false;
                    return;
                }
                if (isPlayingUndocked) {
                    isPlayingUndocked = false;
                }
                else {
                    actions._undockPlaying.execute();
                    isPlayingUndocked = true;
                }
            }
            else {
                actions.closeUndockedWindow.execute();
            }
        }
    };
    
    // Hidden action that actually opens the window, overridden in playingListContainer_add.js
    actions._undockPlaying = {
        title: '',
        hotkeyAble: false,
        execute: () => {
            // the execute func is overridden in playingListContainer_add.js
            messageDlg('The Playing panel must be visible in order to undock it.', 'warn', ['btnOK'], {
                defaultButton: 'btnOK'
            }, undefined);
        }
    }

    actions.undockPlaylist = {
        title: function () {
            return _('Undock');
        },
        icon: 'mode_windowed',
        hotkeyAble: false,
        execute: function () {
            var fromNode = resolveToValue(this.boundObject);
            var node = app.createTree().createNode();
            node.handlerID = fromNode.handlerID;
            node.dataSource = fromNode.dataSource;
            // Post 5.0.3: var node = resolveToValue(this.boundObject).getCopy();
            
            var viewData = currentTabControl.createViewData({node: node});
            var pl = node.dataSource;
            
            openDialog('dlgUndockedControl', {
                modal: false,
                control: 'Multiview',
                playlist: pl,
                viewData: viewData,
                // notShared: true,
            });
        }
    };

    actions.closeUndockedWindow = {
        title: function () {
            return _('Close');
        },
        icon: 'close',
        execute: function () {
            window.cleanupDocument();
            window.closeWindow();
        },
    }
})();
