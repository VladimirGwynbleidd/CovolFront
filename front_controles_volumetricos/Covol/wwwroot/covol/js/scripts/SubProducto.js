$(document).ready(function () {
    ObtenerSubProducto();
    cargarProductos();

    $("#ModalActualizar").on('hidden.bs.modal', function (e) {
        Limpiar();
    });
});

async function cargarProductos() {
    var response;
    var data;
    var mensaje;
    try {
        response = await fetchDataAsync("../covol/api/TipoProducto/ObtenerTipoProducto", "GET", {});
        data = response.responseDataEnumerable;
        $.each(data, function (i, item) {
            var $option = $('<option>', {
                value: item.claveProducto,
                text: item.producto
            });

            $('#Productos').append($option);
        });
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
		setCookie("NombrePagina", "subproducto.html", 1);
        submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}

async function ObtenerSubProducto() {
    var response;
    var dataEnumerable;
    var mensaje;

    try {
        response = await fetchDataAsync('../covol/api/SubProducto/ObtenerSubProducto', 'GET', {});
        dataEnumerable = response.responseDataEnumerable;

        $('#dataTableSubProducto').DataTable({
            destroy: true,
            data: dataEnumerable,
            sort: true,
            searching: true,
            responsive: true,
            columns: [
                { 'data': 'idSubProducto', className: "uniqueClassName" },
                { 'data': 'claveProducto', className: "uniqueClassName" },
                { 'data': 'claveSubProducto', className: "uniqueClassName" },
                { 'data': 'detalleSubProducto', className: "uniqueClassName" },
                { 'data': 'comentario', className: "uniqueClassName" },
                {
                    data: "Acciones", render: function (data, type, row) {
                        return '<a href="#" onclick="return abrirModalActualizar(' + row.idSubProducto + ',' + '\'' + row.claveProducto + '\'' + ',\'' + row.claveSubProducto + '\'' + ',\'' + row.detalleSubProducto + '\'' + ',\'' + row.comentario + '\'' + ')"><i style="color:black" class="fas fa-edit fa-lg"></i></a> <a href="#" onclick="abrirModalBorrar(' + row.idSubProducto + ')"><i style="color:black" class="fas fa-trash-alt fa-fw fa-lg"></i></a>';
                    }, sortable: false, className: "uniqueClassName"
                }
            ]
        });
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        setCookie("NombrePagina", "subproducto.html", 1);
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

async function ActualizarSubProducto() {
    var response;
    var mensaje;
    var argssubProducto;
    var methodStr = '';
    var urlStr = '';
    var res = validaActualizar();

    if (res === false) {
        return false;
    }

    argssubProducto = {
        ClaveProducto: $('#Productos option:selected').val(),
        IdSubProducto: $('#idSubProducto').val(),
        ClaveSubProducto: $('#inputActualizaClaveSubProducto').val(),
        DetalleSubProducto: $('#inputActualizaTipoProducto').val(),
        Comentario: $("#ActualizaMessage").val()
    };

    try {
        urlStr = $('#idSubProducto').val() != 0 ? '../covol/api/SubProducto/ActualizarSubProducto' : '../covol/api/SubProducto/AgregarSubProducto';
        methodStr = $('#idSubProducto').val() != 0 ? 'PUT' : 'POST';
        response = await fetchDataAsync(urlStr, methodStr, JSON.stringify(argssubProducto));

        if (response) {
            Limpiar();
            ObtenerSubProducto();
            $('#ModalActualizar').modal('hide');
        }
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.Mensaje;
		setCookie("NombrePagina", "subproducto.html", 1);
        submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}

async function EliminarSubProducto() {
    var response;
    var mensaje;
    //var argssubProducto = {
    //    IdSubProducto: $('#idSubProducto').val()
    //};

    var IdSubProducto = $('#idSubProducto').val();

    try {
        response = await fetchDataAsync('../covol/api/SubProducto/EliminarSubProducto', 'DELETE', JSON.stringify(IdSubProducto));

        if (response) {
            Limpiar();
            $('#ModalBorrar').modal('hide');
            ObtenerSubProducto();
        }
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
      	setCookie("NombrePagina", "subproducto.html", 1);
        submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}

function validate() {
    var isValid = true;
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
    if ($('#Productos option:selected').val() === '0' || $('#Productos option:selected').val() === undefined) {
        $('#Productos').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Productos').css('border-color', 'lightgrey');
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
    $('#idSubProducto').val("0");
    $('#Productos').val("0");
    $('#inputActualizaClaveSubProducto').val("");
    $('#inputActualizaTipoProducto').val("");
    $('#ActualizaMessage').val("");
}