var LevelLog;

$(document).ready(function () {

    obtenerMarcadores();

    $("#LogModal").on('show.bs.modal', function (e) {
        LevelLog = $(e.relatedTarget).attr("level");
        sendGet("../covol/api/carga/bitacora?level=" + LevelLog, undefined, cargarBitacora);
    });

    $("#btn_enviarArchvivo").click(function () {
        cargarEnviar();
    });
});

async function obtenerMarcadores() {
    var response;
    var data;
    var mensaje;
    try {
        response = await fetchDataAsync("../covol/api/carga/marcadores", "GET", {});
        data = response.responseDataEnumerable;


        var all = 0;

        data.forEach(function (item) {
            switch (item.level) {
                case "ERROR":
                    $("#txtErrores").text(item.registros);
                    break;
                case "INFO":
                    $("#txtCorrectos").text(item.registros);
                    break;
                case "WARN":
                    $("#txtInCorrectos").text(item.registros);
                    break;
            }
            all += item.registros;
        });

        $("#txtProcesados").text(all);
        setCookie("ArchivoCompletos", all, 1);
    } catch (error) {
        console.log('Error de conexión', error);
        response = error.responseJSON;
        mensaje = response.Mensaje;
        if (response.statusHttp == "Unauthorized") {
            setCookie("NombrePagina", "carga.html", 1);
            submitOAuthClient();
        }
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

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}


function cargarBitacora(datos) {
    console.log('Carga bitacora', datos);

    $('#RegistrosB').jtable({
        columnResizable: false,
        animationsEnabled: false,
        openChildAsAccordion: true,
        actions: {
            listAction: window.top.getListData
        },
        fields: {
            '': {
                width: '2%',
                sorting: false,
                display: function (resultData) {
                    var toto = convertDate(resultData.record.fecha);
                    var $img = $('<div style="width:20%;margin:auto;" > <i class="fas fa-angle-down fa-2x text-gray-300"></i><div>');
                    $img.click(function () {
                        if ($(this).children().first().hasClass('fa-angle-down')) {
                            $(this).children().first().removeClass("fa-angle-down").addClass('fa-angle-up');
                            sendGet('../covol/api/carga/DetalleLog?RFC=' + resultData.record.rfc + '&permisionario=' + resultData.record.permisionario + '&Fecha=' + convertDate(resultData.record.fecha) + '&level=' + LevelLog, undefined,
                                function (response) {
                                    $('#RegistrosB').jtable('openChildTable', $img.closest('tr'),
                                        {
                                            paging: true,
                                            pageSize: 5,
                                            sorting: false,
                                            columnResizable: false,
                                            animationsEnabled: false,
                                            showCloseButton: false,

                                            actions: {
                                                listAction: window.top.getListPag,
                                            },
                                            fields: {
                                                level: {
                                                    title: 'Tipo',
                                                    width: '10%'
                                                },
                                                fecha: {
                                                    title: 'Fecha',
                                                    width: '10%',
                                                    type: 'date',
                                                    displayFormat: 'dd/mm/yy'
                                                },
                                                archivo: {
                                                    title: 'Nombre del archivo',
                                                    width: '10%'
                                                },
                                                mensaje: {
                                                    title: 'Mensaje',
                                                    width: '70%'
                                                }
                                            }
                                        }, function cargagrid(data) {
                                            data.childTable.jtable('load', response.responseDataEnumerable);
                                        });
                                });
                        }
                        else {
                            $(this).children().first().removeClass("fa-angle-up").addClass('fa-angle-down')
                            $('#RegistrosB').jtable('closeChildTable', $img.closest('tr'));
                        }
                    });
                    return $img;
                }
            },
            fecha: {
                title: 'Fecha',
                type: 'date',
                displayFormat: 'dd/mm/yy'
            },
            rfc: {
                title: 'RFC'
            },
            permisionario: {
                title: 'Permisionario'
            },
            totalArchivos: {
                title: 'TotalArchivos'
            }
        }
    });
    $('#RegistrosB').jtable('load', datos.responseDataEnumerable);
}

async function cargarEnviar() {
    try {

        var data = new FormData();
        var archivos = $('#file')[0].files;
        if (archivos.length > 0) {
            //$.each(archivos, function (index, item) {
            //    data.append("files", item);
            //});

            //data.append("id", $('#box__file').val());

            //for (var key of data.entries()) {
            //    console.log(key[0] + ', ' + key[1]);
            //}

            $("#modalAutoClose").modal("show");
            setTimeout(function () {
                $('#modalAutoClose').modal('hide');

            }, 4000);
			$('#divEnviarArchivo').addClass('prevent-click');
            $('#divCargaArchivos').addClass('prevent-click');
            var files = $("#file").get(0).files;

            for (var i = 0; i < files.length; i++) {
                var data = new FormData();
                data.append("files", files[i]);
                var uploadFiles = await uploadFileAsync('../covol/api/upload', data);
                obtenerMarcadores();
                //if (uploadFiles) {
                //	obtenerMarcadores();
                //}
                

            }
            window.top.Alerta("Se terminaron de procesar los archivos", 1);
            $('#modalAutoClose').modal('hide');
            $("#tbArchivos tbody").empty();
            $("#Archivos .card-footer").hide();
            $("#smlElemntos").empty();
            $("#tbArchivos tbody").empty();
            $('#divEnviarArchivo').removeClass('prevent-click');
            $('#divCargaArchivos').removeClass('prevent-click');
          
            //$("#modalAutoClose").modal("show");
            //setTimeout(function () {
            //    $('#modalAutoClose').modal('hide');
            //    window.location.replace("cruces.html");
            //}, 4000);

            //var uploadFiles = await uploadFileAsync('../covol/api/upload', data);

            //if (uploadFiles) {
            //    obtenerMarcadores();
            //    $("#tbArchivos tbody").empty();
            //    $("#Archivos .card-footer").hide();
            //    $("#smlElemntos").empty();
            //    $("#tbArchivos tbody").empty();
            //}
        }
        else {
            window.top.Alerta("No hay archivos para enviar", 2);
        }

        $("#drag_box")[0].reset();
    } catch (error) {
        window.top.ocultarLoading();
        console.log('Error de conexión', error);
        
        if (error.status == 500) {
            window.top.Alerta("No se pudieron procesar los archivos, vuelva a intentarlo", 3);
            $('#modalAutoClose').modal('hide');
            $('#divEnviarArchivo').removeClass('prevent-click');
            $('#divCargaArchivos').removeClass('prevent-click');

        }
      
        response = error.responseJSON;
        if (response.statusHttp == "Unauthorized") {
            setCookie("NombrePagina", "carga.html", 1);
            submitOAuthClient();
        }
        if (response.statusHttp == "InternalServerError") {
            console.log('Error de conexión', response.mensaje);
        }
        if (response.statusHttp == "GatewayTimeout") {
            console.log('Error de conexión', response.mensaje);
        }
    }
}


window.setTimeout(function () {
    $(".alert").fadeTo(500, 0).slideUp(500, function () {
        $(this).remove();
    });
}, 2000);

$(function () {
    var alert = $('div.alert[auto-close]');
    alert.each(function () {
        var that = $(this);
        var time_period = that.attr('auto-close');
        setTimeout(function () {
            that.alert('close');
        }, time_period);
    });
});