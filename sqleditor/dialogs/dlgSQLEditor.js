var UI;

function OnSQLExec(sql, resultLV) {

    resultLV.innerHTML = '';

    var tm = Date.now();

    UI.btnExecute.controlClass.disabled = true;
    UI.progress.innerHTML = 'Running query ...';

    app.db.getQueryResultAsync(sql).then(function (res) {
        var tmload = Date.now();
        var table = '<table class="sqltable"><tr>';
        var names = res.names;
        var cols = names.count;
        var rows = 0;
        UI.progress.innerHTML = 'Rendering data ...';
        names.locked(function () {
            for (var i = 0; i < cols; i++) {
                table += '<th>' + names.getValue(i) + '</th>';
            }
        });
        table += '</tr>';
        var loop = 0;
        var token = {
            canceled: false
        };
        asyncLoop(function () {
            loop = 0;
            while (loop < 10 && !res.eof) {
                table += '<tr>';
                for (var i = 0; i < cols; i++) {
                    table += '<td>' + res.fields.getValue(i) + '</td>';
                }
                table += '</tr>';
                res.next();
                rows++;
                loop++;
                if (rows > 1000) break;
            }
            return (rows > 1000) || res.eof;
        }, 0, token, function () {
            resultLV.innerHTML = table;
            UI.btnExecute.controlClass.disabled = false;
            UI.progress.innerHTML = 'Query for ' + rows + ' rows took ' + (tmload - tm) + 'ms (rendering took ' + (Date.now() - tmload) + 'ms)';
        });
    }, function (err) {
        UI.progress.innerHTML = 'Query error "' + err + '"';
        UI.btnExecute.controlClass.disabled = false;
    });
}

function init(params) {
    var wnd = this;
    wnd.title = _('SQL editor');

    UI = getAllUIElements();

    localListen(UI.btnExecute, 'click', () => {
        OnSQLExec(UI.sqlarea.value, UI.resultLV);
    });
}
