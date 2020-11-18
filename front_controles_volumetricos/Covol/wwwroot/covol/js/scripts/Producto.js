$(document).ready(function () {
    ObtenerTipoProducto();
    $("#ModalActualizar").on('hidden.bs.modal', function (e) {
        Limpiar();
    });
});

async function ObtenerTipoProducto() {
    var response;
    var dataEnumerable;
    var mensaje;

    try {
        response = await fetchDataAsync('../covol/api/TipoProducto/ObtenerTipoProducto', 'GET', {});
        dataEnumerable = response.responseDataEnumerable;

        $('#dataTableProducto').DataTable({
            destroy: true,
            data: dataEnumerable,
            sort: true,
            searching: true,
            responsive: true,
            columns: [
                { 'data': 'idProducto', className: "uniqueClassName" },
                { 'data': 'claveProducto', className: "uniqueClassName" },
                { 'data': 'producto', className: "uniqueClassName" },
                { 'data': 'comentario', className: "uniqueClassName" },
                {
                    data: "Acciones", render: function (data, type, row) {
                        return '<a href="#" onclick="return abrirModalActualizar(' + row.idProducto + ',' + '\'' + row.claveProducto + '\'' + ',\'' + row.producto + '\'' + ',\'' + row.comentario + '\'' + ')"><i style="color:black" class="fas fa-edit fa-lg"></i></a>| <a href="#" onclick="abrirModalBorrar(' + row.idProducto + ')"><i style="color:black" class="fas fa-trash-alt fa-fw fa-lg"></i></a>';
                    }, sortable: false, className: "uniqueClassName"
                }
            ],
            columnDefs: [
                { className: "dt-center", targets: [0, 1, 2, 3] }
            ]
        });
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
		setCookie("NombrePagina", "productos.html", 1);
      	submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}

async function submitOAuthClient() {
    var code = getParameterByName("code");
    var state = getParameterByName("state");
    var rfc = "";
    var perfilRequest;
    var tokenRequest;
    var base64UrlToken;
    var token;
    var payload;
    var mensaje;
    try {
        if (code == "" && state == "") {
            $("#formOAuthClient").submit();
        } else {
            tokenRequest = await $.ajax({
                url: "../covol/OauthClient/authtoken?code=" + code,
                method: "POST",
                contentType: 'application/x-www-form-urlencoded',
                dataType: "json"
            });
            token = tokenRequest.access_token;
            deleteCookie("token_covol");
            document.cookie = "token_covol=" + token + ";secure; HttpOnly";
            base64UrlToken = token.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_').split('.');
            payload = JSON.parse(Base64.decode(base64UrlToken[1]).replace(/\u0000/g, ''));
            rfc = payload.cn;
            perfilRequest = await fetchDataAsync("../covol/api/Perfil/ObtenerPerfil", "GET", { "rfc": rfc });
        }
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        window.top.Alerta(mensaje, 3);
    }
}

function validate() {
    var isValid = true;
    if ($('#inputClaveProducto').val().trim() === "") {
        $('#inputClaveProducto').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#inputClaveProducto').css('border-color', 'lightgrey');
    }
    if ($('#inputTipoProducto').val().trim() === "") {
        $('#inputTipoProducto').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#inputTipoProducto').css('border-color', 'lightgrey');
    }
    return isValid;
}

function validaActualizar() {
    var isValid = true;
    if ($('#inputActualizaClaveProducto').val().trim() === "") {
        $('#inputActualizaClaveProducto').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#inputActualizaClaveProducto').css('border-color', 'lightgrey');
    }
    if ($('#inputActualizaTipoProducto').val().trim() === "") {
        $('#inputActualizaTipoProducto').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#inputActualizaTipoProducto').css('border-color', 'lightgrey');
    }
    return isValid;
}

function Limpiar() {
    $('#idTipoProducto').val("0");
    $('#inputClaveProducto').val("");
    $('#inputTipoProducto').val("");
    $('#ActualizaMessage').val("");
    $('#inputActualizaClaveProducto').val("");
    $('#inputActualizaTipoProducto').val("");
}

async function ActualizarTipoProducto() {
    var response;
    var mensaje;
    var argsProducto;
    var methodStr = '';
    var urlStr = '';
    var res = validaActualizar();

    if (res === false) {
        return false;
    }

    argsProducto = {
        idProducto: $('#idTipoProducto').val(),
        ClaveProducto: $('#inputActualizaTipoProducto').val(),
        Producto: $('#inputActualizaClaveProducto').val(),
        Comentario: $('#ActualizaMessage').val()
    };

    try {
        urlStr = $('#idTipoProducto').val() != 0 ? '../covol/api/TipoProducto/ActualizarTipoProducto' : '../covol/api/TipoProducto/AgregarTipoProducto';
        methodStr = $('#idTipoProducto').val() != 0 ? 'PUT' : 'POST';

        response = await fetchDataAsync(urlStr, methodStr, JSON.stringify(argsProducto));

        if (response) {
            Limpiar();
            ObtenerTipoProducto();
            $('#ModalActualizar').modal('hide');
        }
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
		setCookie("NombrePagina", "productos.html", 1);
      	submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}

async function EliminarTipoProducto() {
    var response;
    var mensaje;
    //var argsProducto = {
    //    idProducto: $('#idTipoProducto').val(),

    //};
    var idProducto = $('#idTipoProducto').val();

    try {
        response = await fetchDataAsync('../covol/api/TipoProducto/EliminarTipoProducto', 'DELETE', JSON.stringify(idProducto));

        if (response) {
            Limpiar();
            $('#ModalBorrar').modal('hide');
            ObtenerTipoProducto();
        }
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
      	setCookie("NombrePagina", "productos.html", 1);
      	submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}