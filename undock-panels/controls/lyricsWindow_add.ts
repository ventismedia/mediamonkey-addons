import LyricsWindow from "mediamonkey-types/controls/lyricsWindow";
LyricsWindow.prototype.override({
	initialize: function($super, parentEl, params) {
		$super(parentEl, params);
		var UI = getAllUIElements(this.container);
		
		// Icon serves to undock on main window or to close on sub window
		var icon = window.isMainWindow ? 'mode_windowed' : 'close';
		var tooltip = window.isMainWindow ? 'Undock' : 'Close';
		
		var button = document.createElement('div');
		button.classList.add('noPadding', 'lvHeaderItem');
		button.innerHTML = '<div data-id="unDockBtn" data-icon="' + icon + '" data-tip="' + tooltip + '" style="" class="menuButton toolbutton" data-control-class="ToolButton"></div>';
		UI.header.appendChild(button);
		
		app.listen(button, 'click', () => {
			if (window.isMainWindow) {
				// Open the undocked control
                actions.undockLyrics.execute();
			}
			else {
				// Close the dialog
				closeWindow();
			}
		});
		
		initializeControl(qeid(button, 'unDockBtn'));
	}
})