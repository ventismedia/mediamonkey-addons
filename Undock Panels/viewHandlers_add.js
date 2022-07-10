nodeHandlersClasses.PlaylistBase.prototype.override({
    menu: function($super, node) {
        var menuItems = $super(node);
        menuItems.push({
            action: bindAction(actions.undockPlaylist, () => {
                return node;
            }),
            order: 50,
            grouporder: 10,
        });
        return menuItems;
    }
});