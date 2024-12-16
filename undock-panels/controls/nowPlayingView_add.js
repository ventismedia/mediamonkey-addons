NowPlayingView.prototype.override({
	initialize: function($super, parentEl, params) {
		$super(parentEl, params);
	
		let _createVideoModeSwitchButton = function( iconName, switchFunc, datatip) {
			let div = document.createElement('div');
			div.classList.add('toolbutton');
			div.classList.add('paddingSmall');
			div.style.zIndex = '999999';
			if (datatip) {
				datatip = resolveToValue(datatip);
				if (datatip)
					div.setAttribute('data-tip', datatip);
			}
			loadIcon(iconName, (iconData) => {
				if (!this._cleanUpCalled)
					div.innerHTML = iconData;
			});
			this.localListen(div, 'click', function (e) {
				switchFunc();
				e.stopPropagation();
			}.bind(div));
			this.switcherDiv.appendChild(div);
			return div;
		}.bind(this);
		if (window.currentTabControl) {
			this.btnUndockWindow = _createVideoModeSwitchButton('mode_windowed', function () {
				actions.undockPlayingNode.execute();
			}.bind(this), _('Undock'));
		}
	}
})
	