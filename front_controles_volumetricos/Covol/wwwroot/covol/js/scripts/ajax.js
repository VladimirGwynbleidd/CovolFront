var uriStr;
function sendGet(uri, datos, callback) {
    var queryString = datos === undefined ? datos : $.param(datos);

    $.ajax({
        type: "GET",
        url: uri,
        data: queryString,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            callback(data);
        },
        //error: function (jqXHR, textStatus, errorThrown) {
        //    console.log(jqXHR);
        //    console.log(textStatus);
        //    console.log(errorThrown);
        //    var obj = $.getJSON(jqXHR.responseText);
        //    var er = typeof obj['message'] === 'object' ? JSON.parse(obj['message']) : null;
        //    var message = er === null ? obj['message'] : er['Message'];
        //    uriStr = obj['uri'];
        //    window.top.Alerta(textStatus + ": " + message + " : " + errorThrown + ': ' + obj['uri'], 3);
        //}
    });
    return true;
}

function sendPost(uri, datos) {
    var token = '';
    $.ajax({
        method: "POST",
        data: JSON.stringify(datos),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: uri,
        cache: false,
        headers: {
            "Authorization": token
        },
        error: function (data) {
            console.log('error');
            return data;
        },
        success: function (data) {
            return data;
        }
    });
}