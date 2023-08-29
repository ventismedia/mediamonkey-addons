(() => {
    
    function isDateField(fieldID) {
        return fieldID === 'date' || fieldID === 'origDate';
    }
	
	const supportedFields = ['title', 'album', 'albumArtist', 'artist', 'actors', 'author', 'conductor', 'composer', 'date', 'director', 'comment', 'lyrics', 'origDate'];
	var classificationFields = ['tempo', 'mood', 'occasion', 'quality', 'initialKey'];
    
	actions.copyFieldToField = {
		title: _('Copy field to field') + '...',
		hotkeyAble: false,
		disabled: uitools.notMediaListSelected,
		visible: window.uitools.getCanEdit,
		submenu: () => fromMenuPromise('copy')
	}
	
	actions.swapFields = {
		title: _('Swap fields') + '...',
		hotkeyAble: false,
		disabled: uitools.notMediaListSelected,
		visible: window.uitools.getCanEdit,
		submenu: () => fromMenuPromise('swap')
	}
	
	window._menuItems.editTags.action.submenu.push({
		action: actions.copyFieldToField,
		order: 60,
		grouporder: 10
	});
	window._menuItems.editTags.action.submenu.push({
		action: actions.swapFields,
		order: 65,
		grouporder: 10
	});
	
	// No need to copy the same code between the "Copy X from Y" and the "Swap X and Y" menus. Just change the grouptitle and the execute function
	function fromMenuPromise(type) {
		return new Promise((resolve, reject) => {
			requirejs('controls/trackListView');
			let ret = [];
			for (let i = 0; i < supportedFields.length; i++) {
				let fromFieldID = supportedFields[i];
				let fieldDef = uitools.tracklistFieldDefs[fromFieldID];
				
				ret.push({
					action: {
						title: fieldDef.title,
						submenu: () => toMenuPromise(type, fromFieldID)
					},
					order: i,
					grouporder: 10,
					grouptitle: (type === 'swap') ? 'Swap:' : 'From:',
				});
			}
			let classificationMenu = {
				action: {
					title: _('Classification') + '...',
					submenu: []
				},
				order: 0,
				grouporder: 20
			};
			for (let i in classificationFields) {
                let fromFieldID = classificationFields[i];
				let fieldDef = uitools.tracklistFieldDefs[fromFieldID];
				classificationMenu.action.submenu.push({
					action: {
						title: fieldDef.title,
						submenu: () => toMenuPromise(type, fromFieldID)
					},
					order: i,
					grouporder: 10
				});
			}
			ret.push(classificationMenu);
			
			// Put "custom" tags into a submenu to avoid making the menu really tall
			let customMenu = {
				action: {
					title: _('Custom') + '...',
					submenu: []
				},
				order: 0,
				grouporder: 30
			}
			for (let i = 1; i <= 10; i++) {
				let fromFieldID = 'custom' + i;
				customMenu.action.submenu.push({
					action: {
						title: resolveToValue(uitools.tracklistFieldDefs[fromFieldID].title),
						submenu: () => toMenuPromise(type, fromFieldID)
					},
					order: i,
					grouporder: 10
				});
			}
			ret.push(customMenu);
			resolve(ret);
		});
	}
	
	function toMenuPromise(type, fromFieldID) {
		return new Promise((resolve, reject) => {
			let ret = []
			for (let i = 0; i < supportedFields.length; i++) {
				let toFieldID = supportedFields[i];
				let fieldDef = uitools.tracklistFieldDefs[toFieldID];
				
				ret.push({
					action: {
						title: fieldDef.title,
						execute: () => {
							if (type === 'swap') swapFields(fromFieldID, toFieldID);
							else if (type === 'copy') copyFieldToField(fromFieldID, toFieldID);
						}
					},
                    disabled: (fromFieldID === toFieldID),
					order: i,
					grouporder: 0,
					grouptitle: (type === 'swap') ? 'With:' : 'To:',
				})
			}
			let classificationMenu = {
				action: {
					title: _('Classification') + '...',
					submenu: []
				},
				order: 0,
				grouporder: 20
			};
			for (let i in classificationFields) {
                let toFieldID = classificationFields[i];
				let fieldDef = uitools.tracklistFieldDefs[toFieldID];
				classificationMenu.action.submenu.push({
					action: {
						title: fieldDef.title,
						execute: () => {
							if (type === 'swap') swapFields(fromFieldID, toFieldID);
							else if (type === 'copy') copyFieldToField(fromFieldID, toFieldID);
						}
					},
                    disabled: (fromFieldID === toFieldID),
					order: i,
					grouporder: 10
				});
			}
			ret.push(classificationMenu);
			// Again, putting "custom" tags into a submenu to avoid making the menu really tall
			let customMenu = {
				action: {
					title: 'Custom...',
					submenu: []
				},
				order: 0,
				grouporder: 20
			}
			for (let i = 1; i <= 10; i++) {
				let toFieldID = 'custom' + i;
				customMenu.action.submenu.push({
					action: {
						title: resolveToValue(uitools.tracklistFieldDefs[toFieldID].title),
						execute: () => {
							if (type === 'swap') swapFields(fromFieldID, toFieldID);
							else if (type === 'copy') copyFieldToField(fromFieldID, toFieldID);
						}
					},
					order: i,
					grouporder: 10
				});
			}
			ret.push(customMenu);
			resolve(ret);
		});
	}
	
	async function swapFields(aFieldID, bFieldID) {
		let aFieldDef = uitools.tracklistFieldDefs[aFieldID];
		let bFieldDef = uitools.tracklistFieldDefs[bFieldID];
		
		let tracklist = uitools.getSelectedTracklist();
		await tracklist.whenLoaded();
		let message = sprintf("Swapping %s and %s:\nAre you sure you want to modify %d track%s?", 
			resolveToValue(aFieldDef.title), resolveToValue(bFieldDef.title), tracklist.count, tracklist.count > 1 ? 's' : '');
		
        messageDlg(message, 'Confirmation', ['btnYes', 'btnNo'], {
            defaultButton: 'btnYes'
        }, function (result) {
            if (result.btnID === 'btnYes') {
				
				listAsyncForEach(tracklist, async (track, next) => {
					
					let aField = track[aFieldID];
					let bField = track[bFieldID];
					
					// Comments and lyrics need to be retrieved asynchronously
					if (typeof aFieldDef.getValueAsync === 'function') aField = await aFieldDef.getValueAsync(track); 
					if (typeof bFieldDef.getValueAsync === 'function') bField = await bFieldDef.getValueAsync(track);
                    // a == date (int), b == non-date (string)
                    if (isDateField(aFieldID) && !isDateField(bFieldID)) {
                        aField = utils.myEncodeDate(aField);
                        bField = utils.myDecodeDate(bField);
                    } 
                    // a == non-date (string), b == date (int)
                    if (!isDateField(aFieldID) && isDateField(bFieldID)) {
                        aField = utils.myDecodeDate(aField);
                        bField = utils.myEncodeDate(bField);
                    }
					
					aFieldDef.setValue(track, bField, true /* raw */);
					bFieldDef.setValue(track, aField, true);
					next();
				}, () => {
					uitools.toastMessage.show(sprintf("Modified %s tracks.", tracklist.count), {
						callback: function (notCancelled) {
							// commit
							if (notCancelled) {
								tracklist.commitAsync();
							} 
							// undo
							else {
								// Do the same thing again, in order to reverse it
								listAsyncForEach(tracklist, async (track, next) => {
									let aField = track[aFieldID];
									let bField = track[bFieldID];
									
									if (typeof aFieldDef.getValueAsync === 'function') aField = await aFieldDef.getValueAsync(track); 
									if (typeof bFieldDef.getValueAsync === 'function') bField = await bFieldDef.getValueAsync(track);
                                    // a == date (int), b == non-date (string)
                                    if (isDateField(aFieldID) && !isDateField(bFieldID)) bField = utils.myDecodeDate(bField)
                                    // a == non-date (string), b == date (int)
                                    if (!isDateField(aFieldID) && isDateField(bFieldID)) aField = utils.myDecodeDate(aField);
									
									aFieldDef.setValue(track, bField, true);
									bFieldDef.setValue(track, aField, true);
									next();
								});
							};
						}
					});
				});
            }
        });
	}
	
	async function copyFieldToField(fromFieldID, toFieldID) {
		let fromFieldDef = uitools.tracklistFieldDefs[fromFieldID];
		let toFieldDef = uitools.tracklistFieldDefs[toFieldID];
		
		let tracklist = uitools.getSelectedTracklist();
		await tracklist.whenLoaded();
		let message = sprintf("Copying %s to %s:\nAre you sure you want to modify %d track%s?", 
			resolveToValue(fromFieldDef.title), resolveToValue(toFieldDef.title), tracklist.count, tracklist.count > 1 ? 's' : '');
		var cachedProperties = {}; // to enable undo
		
        messageDlg(message, 'Confirmation', ['btnYes', 'btnNo'], {
            defaultButton: 'btnYes'
        }, function (result) {
            if (result.btnID === 'btnYes') {
				
				listAsyncForEach(tracklist, async (track, next) => {
					
					let newField = track[fromFieldID];
					let oldField = track[toFieldID];
					
					// Comments and lyrics need to be retrieved asynchronously
					if (typeof fromFieldDef.getValueAsync === 'function') newField = await fromFieldDef.getValueAsync(track);
					if (typeof toFieldDef.getValueAsync === 'function') oldField = await toFieldDef.getValueAsync(track);
                    // Date (int) -> non-date (string)
                    if (isDateField(fromFieldID) && !isDateField(toFieldID)) newField = utils.myEncodeDate(newField);
                    // Non-date (string) -> Date (int)
                    if (!isDateField(fromFieldID) && isDateField(toFieldID)) newField = utils.myDecodeDate(newField);
                    
					cachedProperties[track.path] = oldField; // Cache the old property of the track to allow undoing
					toFieldDef.setValue(track, newField, true /* raw */); // Overwrite the track's field
					next();
				}, () => {
					uitools.toastMessage.show(sprintf("Modified %s tracks.", tracklist.count), {
						callback: function (notCancelled) {
							// commit
							if (notCancelled) {
								tracklist.commitAsync();
							} 
							// undo
							else {
								tracklist.forEach(track => {
									let oldField = cachedProperties[track.path];
									oldFieldDef.setValue(track, oldField, true); // Reset it to its previous value
								});
							};
						}
					});
				});
            }
        });
	}
	
})();