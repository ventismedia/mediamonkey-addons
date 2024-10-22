
window.configInfo = {

    load: function (panel, addon) {
        
        var UI = getAllUIElements(panel);
		
		var outputOptions = app.getValue('outputNowPlayingToFile_outputOptions', {
			path: '', outputBefore: '', outputAfter: '',
		});
		
		app.listen(UI.btnOutputFile, 'click', () => {
			app.utils.dialogSaveFile(outputOptions.path, 'txt', _('Text File (*.txt)|*.txt|All files (*.*)|*.*'), _('Output File')).then(async function (resfilename) {
				if (!resfilename)
					return;
				outputOptions.path = resfilename;
				UI.editOutputFile.controlClass.value = resfilename;
			});
		});
		
		UI.editOutputFile.controlClass.value = outputOptions.path;
		UI.outputBefore.controlClass.value = outputOptions.outputBefore;
		UI.outputAfter.controlClass.value = outputOptions.outputAfter;
    },

    save: function (panel, addon) {
        var UI = getAllUIElements(panel);
        
		var outputOptions = {
			path: UI.editOutputFile.controlClass.value,
			outputBefore: UI.outputBefore.controlClass.value,
			outputAfter: UI.outputAfter.controlClass.value,
		}
		
		console.log(outputOptions);
		
		app.setValue('outputNowPlayingToFile_outputOptions', outputOptions);
    }
}
