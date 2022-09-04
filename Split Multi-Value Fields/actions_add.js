actions.cleanMultiValue = {
    title: _('Split multi-value fields') + '...',
    hotkeyAble: true,
    icon: 'cleanMultiValueFields',
    disabled: uitools.notMediaListSelected,
    visible: window.uitools.getCanEdit,
    execute: async function () {
        var list = uitools.getSelectedTracklist();
        var dlg = uitools.openDialog('dlgCleanMultiValue', {
            show: true,
            modal: true,
            title: _('Split multi-value fields'),
            tracks: list
        });
    }
}

window._menuItems.editTags.action.submenu.push({
    action: actions.cleanMultiValue,
    order: 30,
    grouporder: 10
});
