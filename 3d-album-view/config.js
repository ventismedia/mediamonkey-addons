'use strict';
var sett;
const wideSpacingMultiplier = 2;

const lblTitle = `${_('Title')} (${_('Album')})`,
    lblNone = _('None'),
    lblAlbumArtist = _('Album Artist'),
    lblDate = _('Date'),
    lblDesc = _('Description'),
    lblCount = _('# Tracks in Album'),
    lblAlbum = _('Album'),
    lblYear = _('Year'),
    lblTrackTitle = `${_('Title')} (${_('Track')} - ${_('Playing')})`;
    

function textLabelToKey(label) {
    switch(label) {
        case lblNone: return undefined;
        case lblTitle: return 'title';
        case lblAlbumArtist: return 'albumArtist';
        case lblDate: return 'date';
        case lblDesc: return 'description';
        case lblCount: return 'count';
        case lblTrackTitle: return 'trackTitle';
    }
}

function textKeyToLabel(key) {
    if (!key) return lblNone;
    switch(key) {
        case 'title': return lblTitle;
        case 'albumArtist': return lblAlbumArtist;
        case 'date': return lblDate;
        case 'description': return lblDesc;
        case 'count': return lblCount;
        case 'trackTitle': return lblTrackTitle;
    }
}

function hotlinkLabelToKey(label) {
    switch(label) {
        case lblNone: return undefined;
        case lblAlbumArtist: return 'albumartist';
        case lblYear: return 'year';
        case lblAlbum: return 'album';
    }
}

function hotlinkKeyToLabel(key) {
    if (!key) return lblNone;
    switch(key) {
        case 'albumartist': return lblAlbumArtist;
        case 'year': return lblYear;
        case 'album': return lblAlbum;
    }
}

window.configInfo = {
	load: function (pnlDiv, addon) {
        sett = app.getValue('FlowAlbumView_settings', {
            spacingMultiplier: 1,
            disablePerspectiveDistortion: false,
            capFramerate: false,
            highResThumbnails: true,
            backgroundColor: undefined,
            useHotlinks: true,
            throttleCarouselSpeed: true,
            mouseWheelScrollNumber: undefined,
            showPrefix: false,
            textFields: {
                header: 'title',
                subheader: 'albumArtist',
                line1: 'date',
                line2: 'description'
            },
            textHotlinks: {
                header: 'album',
                subheader: undefined,
                line1: 'year',
                line2: undefined
            }
        });
        
        const UI = getAllUIElements(pnlDiv);
        
        if (sett.backgroundColor) {
            UI.bgColor.controlClass.rgb = sett.backgroundColor;
            UI.bgCustomChoice.controlClass.checked = true;
        }
        else {
            UI.bgSkinChoice.controlClass.checked = true;
            UI.bgColor.setAttribute('data-disabled', '1');
        }
        
        localListen(UI.bgCustomChoice, 'click', () => {
            UI.bgColor.removeAttribute('data-disabled');
        });
        localListen(UI.bgSkinChoice, 'click', () => {
            UI.bgColor.setAttribute('data-disabled', '1');
        });
        
        UI.chbHighQuality.controlClass.checked = sett.highResThumbnails;
        UI.chbCapFramerate.controlClass.checked = sett.capFramerate;
        UI.chbDisablePerspective.controlClass.checked = sett.disablePerspectiveDistortion;
        UI.mouseScrollNum.controlClass.value = String(sett.mouseWheelScrollNumber || 'Use Windows setting');
        UI.chbWiderAlbums.controlClass.checked = (sett.spacingMultiplier == wideSpacingMultiplier);
        UI.chbPrefix.controlClass.checked = sett.showPrefix;
        
        var textFieldItems = [lblNone,lblTitle,lblAlbumArtist,lblDate,lblDesc,lblCount,lblTrackTitle].join(',');
        var hotlinkFieldItems = [lblNone,lblAlbum,lblYear,lblAlbumArtist].join(',');
        // var textFieldItems = `None,${lblTitle},Album Artist,Date,Description,# Tracks`;
        // var hotlinkFieldItems = 'None,Album,Year,Album Artist';
        
        UI.textFieldHeader.controlClass.items = textFieldItems;
        UI.textFieldSubheader.controlClass.items = textFieldItems;
        UI.textFieldLine1.controlClass.items = textFieldItems;
        UI.textFieldLine2.controlClass.items = textFieldItems;
        
        UI.hotlinkFieldHeader.controlClass.items = hotlinkFieldItems;
        UI.hotlinkFieldSubheader.controlClass.items = hotlinkFieldItems;
        UI.hotlinkFieldLine1.controlClass.items = hotlinkFieldItems;
        UI.hotlinkFieldLine2.controlClass.items = hotlinkFieldItems;
        
        UI.textFieldHeader.controlClass.value = textKeyToLabel(sett.textFields.header);
        UI.textFieldSubheader.controlClass.value = textKeyToLabel(sett.textFields.subheader);
        UI.textFieldLine1.controlClass.value = textKeyToLabel(sett.textFields.line1);
        UI.textFieldLine2.controlClass.value = textKeyToLabel(sett.textFields.line2);
        
        UI.hotlinkFieldHeader.controlClass.value = hotlinkKeyToLabel(sett.textHotlinks.header);
        UI.hotlinkFieldSubheader.controlClass.value = hotlinkKeyToLabel(sett.textHotlinks.subheader);
        UI.hotlinkFieldLine1.controlClass.value = hotlinkKeyToLabel(sett.textHotlinks.line1);
        UI.hotlinkFieldLine2.controlClass.value = hotlinkKeyToLabel(sett.textHotlinks.line2);
	},
	save: function(pnlDiv, addon) {
        
        const UI = getAllUIElements(pnlDiv);
        
        sett.textFields.header = textLabelToKey(UI.textFieldHeader.controlClass.value);
        sett.textFields.subheader = textLabelToKey(UI.textFieldSubheader.controlClass.value);
        sett.textFields.line1 = textLabelToKey(UI.textFieldLine1.controlClass.value);
        sett.textFields.line2 = textLabelToKey(UI.textFieldLine2.controlClass.value);
        
        sett.textHotlinks.header = hotlinkLabelToKey(UI.hotlinkFieldHeader.controlClass.value);
        sett.textHotlinks.subheader = hotlinkLabelToKey(UI.hotlinkFieldSubheader.controlClass.value);
        sett.textHotlinks.line1 = hotlinkLabelToKey(UI.hotlinkFieldLine1.controlClass.value);
        sett.textHotlinks.line2 = hotlinkLabelToKey(UI.hotlinkFieldLine2.controlClass.value);
        
        if (UI.mouseScrollNum.controlClass.value == 'Use Windows setting') sett.mouseWheelScrollNumber = undefined;
        else sett.mouseWheelScrollNumber = parseInt(UI.mouseScrollNum.controlClass.value);
        
        // sett.throttleCarouselSpeed = UI.chbThrottleCarouselSpeed.controlClass.checked;
        sett.highResThumbnails = UI.chbHighQuality.controlClass.checked;
        sett.capFramerate = UI.chbCapFramerate.controlClass.checked;
        sett.disablePerspectiveDistortion = UI.chbDisablePerspective.controlClass.checked;
        sett.spacingMultiplier = (UI.chbWiderAlbums.controlClass.checked) ? wideSpacingMultiplier : 1;
        sett.showPrefix = UI.chbPrefix.controlClass.checked;
        
        // if custom choice is selected, then set the background
        if (UI.bgCustomChoice.controlClass.checked) {
            sett.backgroundColor = UI.bgColor.controlClass.rgb;
        }
        else sett.backgroundColor = undefined;
        
        // Save the values
        app.setValue('FlowAlbumView_settings', sett);
        
        // Ensure thumbnail cache size is 512px
        var iniSett = window.settings.get('Options');
        iniSett.Options.imageCacheSizes = '80;200;512';
        window.settings.set(iniSett, 'Options');
        
        // Notify the settings change, for the view control to update
        app.notifySettingsChange();
        app.flushState();
	}
}