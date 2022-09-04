LyricsWindow.prototype.override({
	initialize: function($super, parentEl, params) {
		$super(parentEl, params);
		var UI = getAllUIElements(this.container);
        
        // Create the UI buttons
		var btnFontPlus = document.createElement('div');
		btnFontPlus.classList.add('noPadding', 'lvHeaderItem');
        btnFontPlus.innerHTML =
            '<div data-id="btnFontPlus" data-icon="add" data-tip="Increase font size" style="" class="menuButton toolbutton" data-control-class="ToolButton"></div>';
        
		var btnFontMinus = document.createElement('div');
		btnFontMinus.classList.add('noPadding', 'lvHeaderItem');
        btnFontMinus.innerHTML =
            '<div data-id="btnFontMinus" data-icon="remove" data-tip="Decrease font size" style="" class="menuButton toolbutton" data-control-class="ToolButton"></div>';
        
        UI.header.insertBefore(btnFontMinus, UI.saveLyricsBtn);
        UI.header.insertBefore(btnFontPlus, UI.saveLyricsBtn);
        
        // Get the saved font size
        var fontSize = app.getValue('lyricsWindow_fontSize', 0.85); // Default font size, in em
        const FONT_SIZE_INTERVAL = 0.05;
        setFontSize();
		
        // Listen to clicks
		this.localListen(btnFontPlus, 'click', () => {
            fontSize += FONT_SIZE_INTERVAL;
            setFontSize();
		});
		this.localListen(btnFontMinus, 'click', () => {
            fontSize -= FONT_SIZE_INTERVAL;
            setFontSize();
		});
		
        // Initialize the tool buttons
		initializeControls(btnFontPlus);
		initializeControls(btnFontMinus);
        
        // Save & set the new font size
        function setFontSize() {
            app.setValue('lyricsWindow_fontSize', fontSize);
            UI.fLyrics.style.fontSize = fontSize + 'em';
        }
	}
})