requirejs('controls/trackListView');
var addonPrefs, tracklist, multiStringSeparator;
var multiValueFieldDefs = {};
var minTracksCountBeforeWarning = 50;

function init(params) {
    var wnd = this;
    wnd.resizeable = true;
    // wnd.noAutoSize = true; // disable auto sizing mechanism, we have fixed size
    wnd.title = params.title;

    tracklist = params.tracks;

    var sett = window.settings.get('Appearance');
    multiStringSeparator = sett.Appearance.MultiStringSeparator;

    addonPrefs = app.getValue('featuredArtistsToArtists_savedPrefs', {
        keywordList: ['feat', 'ft', 'featuring'],
        AskUserMassEdit: true
    });

    var UI = getAllUIElements();
    
    UI.editKeywordList.controlClass.value = addonPrefs.keywordList.join(', ');
    
    window.localListen(qid('btnOK'), 'click', btnOkClick);
    window.localListen(qid('btnCancel'), 'click', btnCancelClick, true);
}

function btnOkClick() {
    savePrefs();

    if (tracklist.count < minTracksCountBeforeWarning || !addonPrefs.AskUserMassEdit) {
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
    
    var featKeywordGroup = addonPrefs.keywordList.join('|');
    // Regex for featured artist in parentheses - /\s*(?:(\(|\[|\{))\s*(feat|ft|featuring)\.*\s+(?<featArtist>([^\n\)\]\}])+)(?:(\)|\]|\}))/i
    var parenRegex = new RegExp('\\s*(?:(\\(|\\[|\\{))\\s*(' + featKeywordGroup + ')\\.*\\s+(?<featArtist>([^\\n\\)\\]\\}])+)(?:(\\)|\\]|\\}))', 'i');
    // Regex for featured artist without parentheses - /\s+(feat|ft|featuring)\.*\s+(?<featArtist>([^\n])+)/i
    var noParenRegex = new RegExp('\\s+(' + featKeywordGroup + ')\\.*\\s+(?<featArtist>([^\\n\\(\\[\\{])+)', 'i');
    
    var progress = app.backgroundTasks.createNew();
    progress.leadingText = _('Split Featured Artists') + ': ';
    var count = tracklist.count;
    var alreadyDone = 0;

    listAsyncForEach(tracklist, (itm, next) => {

        var updateNeeded = false;
        var title = itm.title;
        var oldTitle = title;
        var artists = itm.artist.split(multiStringSeparator);
        
        // For each regex, check if the title contains a match and then perform the replace
        for (let regex of [parenRegex, noParenRegex]) {
            let match = title.match(regex);
            if (match) {
                // Remove the pattern from the title
                title = title.replace(regex, ' ').trim(); 
                // Add the captured featured artist to the artists list
                if (match.groups && match.groups.featArtist) {
                    artists.push(match.groups.featArtist);
                }
                updateNeeded = true;
            }
            // check if there's a featured artist in the artist tag
            for (let i in artists) {
                let artist = artists[i];
                let match = artist.match(regex);
                if (match) {
                    console.log(match);
                    // Remove the pattern from this artist
                    artists[i] = artist.replace(regex, ' '); // need to add a space in case of Title ft. Artist (Remix) becoming Title(Remix)
                    // Add the captured featured artist to the  artists list
                    if (match.groups && match.groups.featArtist) {
                        artists.push(match.groups.featArtist);
                    }
                    updateNeeded = true;
                }
            }
            if (updateNeeded) break; // No need to do both regexes
        }
        
        for (let i in artists) artists[i] = artists[i].trim(); // get rid of unnecessary spaces
        
        if (updateNeeded) {
            itm.beginUpdate();
            itm.title = title;
            itm.artist = artists.join(multiStringSeparator);
            itm.endUpdate();
        }
        
        alreadyDone++;
        progress.text = sprintf(' %d/%d: %s', alreadyDone, count, oldTitle);
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
    
    var editContents = UI.editKeywordList.controlClass.value;
    var keywordList = editContents.split(',');
    for (let i in keywordList) {
        keywordList[i] = keywordList[i].trim();
    }
    
    addonPrefs.keywordList = keywordList;

    app.setValue('featuredArtistsToArtists_savedPrefs', addonPrefs);
}
