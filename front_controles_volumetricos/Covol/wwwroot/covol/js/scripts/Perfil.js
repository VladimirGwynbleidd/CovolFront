$(document).ready(function () {

    ObtenerPerfil();
    ObtenerPerfiles();

    $("#ModalActualizar").on('hidden.bs.modal', function (e) {
        Limpiar();
    });

});

async function ObtenerPerfiles() {
    var response;
    var data;
    var mensaje;
    try {
        response = await fetchDataAsync("../covol/api/Perfil/CatalogoPerfiles", "GET", {});
        data = response.responseDataEnumerable;
        $.each(data, function (i, item) {
            var $option = $('<option>', {
                value: item.idPerfil,
                text: item.dperfil
            });
            $('#inputActualizaPerfil').append($option);
        });
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        setCookie("NombrePagina", "perfiles.html", 1);
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

async function ObtenerPerfil() {
    var response;
    var dataEnumerable;
    var mensaje;
    try {
        response = await fetchDataAsync('../covol/api/Perfil/ObtenerPerfil', 'GET', {});
        dataEnumerable = response.responseDataEnumerable;

        $('#dataTablePerfil').DataTable({
            destroy: true,
            data: dataEnumerable,
            sort: true,
            searching: true,
            responsive: true,
            columns: [
                { 'data': 'idUsuario', className: "uniqueClassName" },
                { 'data': 'nombre', className: "uniqueClassName" },
                { 'data': 'rfc', className: "uniqueClassName" },
                { 'data': 'dperfil', className: "uniqueClassName" },
                { 'data': 'carga', render: function (data, type, row) { return '<center><input type="checkbox" disabled="disabled" id="inputcarga" title="carga" ' + (row.carga === true ? "checked" : "") + '/></center>' } },
                { 'data': 'catalogo', render: function (data, type, row) { return '<center><input type="checkbox" disabled="disabled" id="inputCatalogo" title="Catalogo" ' + (row.catalogo === true ? "checked" : "") + '/> </center>' } },
                { 'data': 'cruce', render: function (data, type, row) { return '<center><center><input type="checkbox" disabled="disabled" id="inputCruce" title="cruce" ' + (row.cruce === true ? "checked" : "") + '/> </center>' } },
                {
                    data: "Acciones", render: function (data, type, row) {
                        return '<a href="#" onclick="return abrirModalActualizar(' + row.idUsuario + ',' + '\'' + row.idPerfil + '\'' + ',' + '\'' + row.nombre + '\'' + ',' + '\'' + row.rfc + '\'' + ',\'' + row.carga + '\'' + ',\'' + row.catalogo + '\'' + ',\'' + row.cruce + '\'' + ')"><i style="color:black" class="fas fa-edit fa-lg"></i></a>| <a href="#" onclick="abrirModalBorrar(' + row.idUsuario + ')"><i style="color:black" class="fas fa-trash-alt fa-fw fa-lg"></i></a>';
                    }, sortable: false, className: "uniqueClassName"
                }
            ],
            columnDefs: [
                { className: "dt-center", targets: [0, 1, 2, 3, 4, 5, 6] }
            ]
        });
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        setCookie("NombrePagina", "perfiles.html", 1);
        submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}

function validaActualizar() {
    var isValid = true;
    var e = document.getElementById("inputActualizaPerfil");
    var sel = e.options[e.selectedIndex].value;
    if (sel === 0) {
        $('#inputActualizaPerfil').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#inputActualizaPerfil').css('border-color', 'lightgrey');
    }
    if ($('#inputActualizaNombre').val().trim() === "") {
        $('#inputActualizaNombre').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#inputActualizaNombre').css('border-color', 'lightgrey');
    }
    if ($('#inputActualizaRFC').val().trim() === "") {
        $('#inputActualizaRFC').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#inputActualizaRFC').css('border-color', 'lightgrey');
    }
    if (!$('#inputActualizaCarga')[0].checked && !$('#inputActualizaCatalogo')[0].checked && !$('#inputActualizaCruce')[0].checked) {
        $('#inputActualizaCarga').css('border-color', 'Red');
        $('#inputActualizaCatalogo').css('border-color', 'Red');
        $('#inputActualizaCruce').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#inputActualizaCarga').css('border-color', 'lightgrey');
        $('#inputActualizaCatalogo').css('border-color', 'lightgrey');
        $('#inputActualizaCruce').css('border-color', 'lightgrey');
    }
    return isValid;
}

function Limpiar() {
    $('#IdUsuario').val("0");
    $('#idPerfil').val("0");
    $('#inputActualizaPerfil').val(0);
    $('#inputActualizaNombre').val("");
    $('#inputActualizaRFC').val("");
    $('#inputActualizaCarga').prop("checked", false);
    $('#inputActualizaCatalogo').prop("checked", false);
    $('#inputActualizaCruce').prop("checked", false);
}

async function ActualizarPerfil() {
    var response;
    var mensaje;
    var argsPerfil;
    var methodStr = '';
    var urlStr = '';
    var res = validaActualizar();

    if (res === false) {
        return false;
    }

    argsPerfil = {
        IdUsuario: $('#IdUsuario').val(),
        idPerfil: $('#inputActualizaPerfil').val(),
        Nombre: $('#inputActualizaNombre').val(),
        RFC: $('#inputActualizaRFC').val(),
        dperfil: $('#inputActualizaPerfil').val(),
        carga: ($('#inputActualizaCarga').prop('checked') ? 1 : 0),
        catalogo: ($('#inputActualizaCatalogo').prop('checked') ? 1 : 0),
        cruce: ($('#inputActualizaCruce').prop('checked') ? 1 : 0),
    };

    try {
        urlStr = $('#IdUsuario').val() != 0 ? '../covol/api/Perfil/ActualizarPerfil' : '../covol/api/Perfil/AgregarPerfil';
        methodStr = $('#IdUsuario').val() != 0 ? 'PUT' : 'POST';

        response = await fetchDataAsync(urlStr, methodStr, JSON.stringify(argsPerfil));

        if (response) {
            Limpiar();
            ObtenerPerfil();
            $('#ModalActualizar').modal('hide');
        }
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
		setCookie("NombrePagina", "perfiles.html", 1);
        submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}

async function EliminarPerfil() {
    var response;
    var mensaje;
    var uri;
    var argsPerfil = {
        IdUsuario: $('#IdUsuario').val(),
    };

    try {
        response = await fetchDataAsync('../covol/api/Perfil/EliminarPerfil', 'DELETE', JSON.stringify(argsPerfil));

        if (response) {
            ObtenerPerfil();
            $('#ModalBorrar').modal('hide');
            Limpiar();
        }
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
      	uri = response.uri;
      	setCookie("NombrePagina", "perfiles.html", 1);
        submitOAuthClient();        
        //window.top.Alerta(mensaje, 3);
    }
}