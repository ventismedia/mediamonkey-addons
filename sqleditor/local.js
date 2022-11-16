(function () {
    window.uitools.addToolButton('righttoolbuttons', 'sql' /* icon */ , function () {
        var dlg = uitools.openDialog('dlgSQLEditor', {
            show: true,
            notShared: true,
            title: 'SQL Editor',
        });
    }, 'SQL Editor');
})();