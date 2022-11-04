LyricsWindow.prototype.override({
	initialize: function($super, parentEl, params) {
		$super(parentEl, params);
		const UI = getAllUIElements(this.container);
        
        // Create the UI buttons
		const btnFontPlus = document.createElement('div');
		btnFontPlus.classList.add('noPadding', 'lvHeaderItem');
        btnFontPlus.innerHTML =
            '<div data-id="btnFontPlus" data-icon="add" data-tip="Increase font size" style="" class="menuButton toolbutton" data-control-class="ToolButton"></div>';
        
		const btnFontMinus = document.createElement('div');
		btnFontMinus.classList.add('noPadding', 'lvHeaderItem');
        btnFontMinus.innerHTML =
            '<div data-id="btnFontMinus" data-icon="remove" data-tip="Decrease font size" style="" class="menuButton toolbutton" data-control-class="ToolButton"></div>';
        
        UI.header.insertBefore(btnFontMinus, UI.saveLyricsBtn);
        UI.header.insertBefore(btnFontPlus, UI.saveLyricsBtn);
        
        // Get the saved font size
        const FONT_SIZE_INTERVAL = 0.05;
        const FONT_SIZE_DEFAULT = 0.85; // Default font size, in em
        const MAX_FONT_SIZE = 50;
        const MIN_FONT_SIZE = 0.1;
        let fontSize = parseFloat(app.getValue('lyricsWindow_fontSize', FONT_SIZE_DEFAULT)); 
        setFontSize();
		
        // Listen to clicks
		this.localListen(btnFontPlus, 'click', () => {
            fontSize *= (1 + FONT_SIZE_INTERVAL);
            setFontSize();
		});
		this.localListen(btnFontMinus, 'click', () => {
            fontSize *= (1 - FONT_SIZE_INTERVAL);
            setFontSize();
		});
		
        // Initialize the tool buttons
		initializeControls(btnFontPlus);
		initializeControls(btnFontMinus);
        
        // Save & set the new font size
        function setFontSize() {
            fontSize = Math.min(Math.max(MIN_FONT_SIZE, fontSize), MAX_FONT_SIZE); // clamp to min and max font sizes
            app.setValue('lyricsWindow_fontSize', fontSize);
            UI.fLyrics.style.fontSize = fontSize + 'em';
        }
	}
})