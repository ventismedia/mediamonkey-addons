requirejs('controls/trackListView');
var addonPrefs, tracklist, multiStringSeparator;
var multiValueFieldDefs = {};
var minTracksCountBeforeWarning = 10;

function init(params) {
    var wnd = this;
    wnd.resizeable = true;
    // wnd.noAutoSize = true; // disable auto sizing mechanism, we have fixed size
    wnd.title = params.title;

    tracklist = params.tracks;

    var sett = window.settings.get('Appearance');
    multiStringSeparator = sett.Appearance.MultiStringSeparator;

    addonPrefs = app.getValue('cleanMultiValueFields_savedPrefs', {
        checkboxes: {
            chbSep1: true,
            chbSep2: true,
            chbSep3: true,
            chbSep4: false,
        },
        inputs: {
            editSep1: ',',
            editSep2: '+',
            editSep3: '&',
            editSep4: ' and ',
        },
        AskUserMassEdit: true
    });

    var UI = getAllUIElements();

    // For each item in the saved preferences, set the corresponding checkbox to enabled/disabled
    for (let id in addonPrefs.checkboxes) {
        let checked = addonPrefs.checkboxes[id];
        if (UI.hasOwnProperty(id)) {
            UI[id].controlClass.checked = checked;
        }
    }

    // For each item in the saved preferences, set the corresponding input's contents
    for (let id in addonPrefs.inputs) {
        let value = addonPrefs.inputs[id];
        if (UI.hasOwnProperty(id)) {
            UI[id].controlClass.value = value;
        }
    }

    // Get a list of all tracklist fields that support multi-values (defined in controls/trackListView.js, multi-value field defs have a common "editor" attribute)
    for (let key in uitools.tracklistFieldDefs) {
        let field = uitools.tracklistFieldDefs[key];
        if (field.editor == editors.gridViewEditors.multiValueEdit) {
            multiValueFieldDefs[key] = field;
        }
    }
    
    var fieldsList = [];
    for (let key in multiValueFieldDefs) fieldsList.push(multiValueFieldDefs[key].title);
    fieldsList.sort();
    
    qid('fullList').innerText = `${_('Fields')}: ${_('Artists')}, ${_('Album Artists')}, ${_('Albums')}, ${_('Composers')}, ...`;
    qid('fullList').setAttribute('data-tip', fieldsList.join(', '));

    window.localListen(qid('btnOK'), 'click', btnOkClick);
    window.localListen(qid('btnCancel'), 'click', btnCancelClick, true);
}

function btnOkClick() {
    savePrefs();

    if (tracklist.count < 10 || !addonPrefs.AskUserMassEdit) {
        doFixTags();
    } else {
        // Ask user if they want to modify the files if greater than threshold
        var msg = sprintf(_('Are you sure that you want to modify %d files ?'), tracklist.count);
        messageDlg(msg, 'Confirmation', ['btnYes', 'btnNo'], {
            defaultButton: 'btnNo',
            chbCaption: _('In the future, do not ask me'),
            checked: false
        }, function (result) {
            if (result.btnID === 'btnYes') {
                if (result.checked)
                    addonPrefs.AskUserMassEdit = false;
                // Perform tag fix
                doFixTags();
            }
        });
    }

    modalResult = 1;
}

function btnCancelClick() {

}

async function doFixTags() {
    // get a list of separators the user wishes to check for
    var separators = [];
    for (let id in addonPrefs.checkboxes) {
        if (addonPrefs.checkboxes[id] === true) {
            let inputKey = id.replace('chb', 'edit'); // transform chbSep1 -> editSep1, etc.
            separators.push(addonPrefs.inputs[inputKey]);
        }
    }
    var regexes = [];
    for (let sep of separators) {
        // Escape all non-letter characters to create a regex that doesn't confuse characters for commands, and escape whitespace as \s
        let escapedRegexPattern = sep.replace(/([^A-z\s]|\^)+/g, '\\$1').replace(/\s+/g, '\\s');
        regexes.push(new RegExp('\\s{0,1}' + escapedRegexPattern + '\\s{0,1}', 'g'));
    }

    var progress = app.backgroundTasks.createNew();
    progress.leadingText = _('Clean Multi-Value Fields') + ': ';
    var count = tracklist.count;
    var alreadyDone = 0;

    listAsyncForEach(tracklist, (itm, next) => {

        var updateNeeded = false;
        // For each multi-value-supported field, check if it contains any of the offending separators
        for (let key in multiValueFieldDefs) {
            if (itm.hasOwnProperty(key)) {
                // Perform regexes on a temporary variable to reduce performance impact
                let tmp = itm[key];
                // Perform the search & replace
                for (let regex of regexes) {
                    tmp = tmp.replace(regex, multiStringSeparator);
                    // Trim the whitespace before and after the separator
                }
                if (itm[key] != tmp) {
                    if (!updateNeeded) {
                        updateNeeded = true;
                        itm.beginUpdate();
                    }
                    itm[key] = tmp;
                }
            }
        }
        if (updateNeeded)
            itm.endUpdate();

        alreadyDone++;
        progress.text = sprintf(' %d/%d: %s', alreadyDone, count, itm.title);
        progress.value = alreadyDone / count;
        next(progress.terminated);
    }, () => {
        if (!progress.terminated) {
            progress.terminate();
            tracklist.commitAsync();
        }
    });

}

function savePrefs() {
    var UI = getAllUIElements();

    // For each checkbox and input, save its state to cleanMultiValueFields_savedPrefs
    for (let id in addonPrefs.checkboxes) {
        if (UI.hasOwnProperty(id)) {
            let checked = UI[id].controlClass.checked;
            addonPrefs.checkboxes[id] = checked;
        }
        // In case something went wrong with the saved preferences and an id exists that doesn't correspond with an element in the html, remove it from the saved preferences
        else {
            delete(addonPrefs.checkboxes[id]);
        }
    }

    for (let id in addonPrefs.inputs) {
        if (UI.hasOwnProperty(id)) {
            let value = UI[id].controlClass.value;
            addonPrefs.inputs[id] = value;
        }
        // in case something went wrong (as noted above)
        else {
            delete(addonPrefs.inputs[id]);
        }
    }

    app.setValue('cleanMultiValueFields_savedPrefs', addonPrefs);
}
