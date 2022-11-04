Rating.prototype.override({
    initialize: function($super, parentel, params) {
        
        this.localListen(parentel, 'load', () => {
            // steal the first rating star & modify it into a bomb (so we keep its style attributes)
            this.bomb = this.stars[0].cloneNode(false /* Don't clone the SVG contents */);
            loadIconFast('bomb', (icon) => {
                setIconFast(this.bomb, icon); // Replace icon
                this.canvas.insertBefore(this.bomb, this.stars[0]);
                if (this._needsRatingRefresh) {
                    this._needsRatingRefresh = false;
                    this.setRating(this._value, {
                        disableChangeEvent: true,
                    });
                }
            });
        });
        
        $super(parentel, params);
    },
    
    setRating: function($super, val, params) {
        $super(val, params);
        if (!this.bomb) {
            this._needsRatingRefresh = true; // bomb icon might load after this.value is set
        }
        if (typeof val === 'string') val = parseInt(val);
        if (val === 0) {
            if (this.stars[0])
                this.stars[0].style.display = 'none';
            for (let i = 1; i < 5; i++) {
                if (this.stars[i]) {
                    this.stars[i].style.opacity = '0'; // 
                }
            }
            if (this.bomb) {
                this.bomb.style.display = 'inline-block';
                this.bomb.removeAttribute('data-emptystar');
                this.bomb.setAttribute('data-fullstar', '1');
            }
        }
        else {
            if (this.bomb) {
                this.bomb.style.display = 'none';
                this.bomb.removeAttribute('data-fullstar');
                this.bomb.setAttribute('data-emptystar', '1');
            }
            for (let i = 1; i < 5; i++) {
                if (this.stars[i]) {
                    this.stars[i].style.opacity = '';
                }
            }
        }
    },
});