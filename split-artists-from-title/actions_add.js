actions.featuredArtistsToArtists = {
    title: _('Split Artists from Title') + '...',
    hotkeyAble: true,
    icon: 'multipleArtists',
    disabled: uitools.notMediaListSelected,
    visible: window.uitools.getCanEdit,
    execute: async function () {
        var list = uitools.getSelectedTracklist();
        var dlg = uitools.openDialog('dlgFeaturedArtistsToArtists', {
            show: true,
            modal: true,
            title: _('Split Artists from Title'),
            tracks: list
        });
    }
}

window._menuItems.editTags.action.submenu.push({
    action: actions.featuredArtistsToArtists,
    order: 40,
    grouporder: 10
});
