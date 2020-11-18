/* State IDS */
var states = ['AGU', 'BCN', 'BCS', 'CAM', 'CHH',
    'CHP', 'COA', 'COL', 'DIF', 'DUR',
    'GRO', 'GUA', 'HID', 'JAL', 'MEX',
    'MIC', 'MOR', 'NAY', 'NLE', 'OAX',
    'PUE', 'QUE', 'ROO', 'SIN', 'SLP',
    'SON', 'TAB', 'TAM', 'TLA', 'VER',
    'YUC', 'ZAC'
];
/* State Names */
var state_names = ['Aguascalientes', 'Baja California Norte', 'Baja California Sur', 'Campeche', 'Chihuahua',
    'Chiapas', 'Coahuila', 'Colima', 'Ciudad de M&eacute;xico', 'Durango', 'Guerrero', 'Guanajuato', 'Hidalgo', 'Jalisco',
    'Edo. de M&eacute;xico', 'Michoac&aacute;n', 'Morelos', 'Nayarit', 'Nuevo Le&oacute;n', 'Oaxaca', 'Puebla', 'Queretaro',
    'Quintana Roo', 'Sinaloa', 'San Luis Potos&iacute;', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
    'Yucat&aacute;n', 'Zacatecas'];

$(function () {
    $('.map').maphilight({ fade: false });
});

$(document).ready(function () {
    try {
        var idZonaValor = 0;
        //sendGet("../covol/api/ValorEstimulo/Zonas", undefined, mostrarZonas);

        ObtenerZonas();

        $('.area').hover(function () {
            var id = $(this).attr('id');
            var state = $.inArray(id, states);
            $('#edo').html(state_names[state]);
        });

        $("#ModalPermicionarios").on('show.bs.modal', function (e) {
            var FiltrosCruce = {};
            if (e.relatedTarget.title === '' || e.relatedTarget.title === undefined) {
                FiltrosCruce.zona = $(e.relatedTarget).attr("zona");
            } else {
                FiltrosCruce.estado = e.relatedTarget.title;
            }

            ObtenerPermisionarios(FiltrosCruce);
            //sendGet("../covol/api/ValorEstimulo/Permisionarios", FiltrosCruce, mostrarPermicionarios);
        });

        $("#ModalActualizar").on('show.bs.modal', function (e) {
            var FiltrosCruce = {
                "zona": $(e.relatedTarget).attr("zona")
            };

            idZonaValor = $(e.relatedTarget).data("zonavalor");

            sendGet("../covol/api/ValorEstimulo/Zonas", FiltrosCruce, setAztualizacion);
        });

        $("#btn-actualizarEstimulo").click(function () {
            ActualizarValorEstimulo(idZonaValor, $("#ValorMagna").val(), $("#ValorPremium").val());
        });
    }
    catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        setCookie("NombrePagina", "valorestimulo.html", 1);
        submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
});

async function ObtenerPermisionarios(FiltrosCruce) {
    try {
        var response;
        response = await fetchDataAsync("../covol/api/ValorEstimulo/Permisionarios", "GET", FiltrosCruce);
        data = response;
        console.log(data);
        if (data) {
            mostrarPermicionarios(data);
        }
        //sendGet("../covol/api/ValorEstimulo/Zonas", undefined, mostrarZonas);
    } catch (error) {
        response = error.responseJSON;
        setCookie("NombrePagina", "valorestimulo.html", 1);
        submitOAuthClient();
    }

}

async function ObtenerZonas() {
    try {
        var response;
        response = await fetchDataAsync("../covol/api/ValorEstimulo/Zonas", "GET", mostrarZonas);
        data = response;
        console.log(data);
        if (data) {
            mostrarZonas(data);
        }
        //sendGet("../covol/api/ValorEstimulo/Zonas", undefined, mostrarZonas);
    } catch (error) {
        response = error.responseJSON;
        setCookie("NombrePagina", "valorestimulo.html", 1);
        submitOAuthClient();
    }

}

function mostrarPermicionarios(datos) {
    $('#Permicionarios').jtable({
        paging: true,
        pageSize: 10,
        sorting: false,
        columnResizable: false,
        animationsEnabled: false,
        showCloseButton: false,
        actions: {
            listAction: window.top.getListPag,
        },
        fields: {
            '': {
                width: '2%',
                sorting: false,
                display: function (resultData) {
                    var $img = $('<div style="width:20%;margin:auto;" > <i class="fas fa-angle-down fa-2x text-gray-300"></i><div>');
                    $img.click(function (e) {
                        if ($(this).children().first().hasClass('fa-angle-down')) {
                            $(this).children().first().removeClass("fa-angle-down").addClass('fa-angle-up');
                            var FiltrosCruce = {
                                "estado": resultData.record.entidad,
                                "RFC": resultData.record.rfc
                            };
                            sendGet('../covol/api/ValorEstimulo/EstacionesServicio', FiltrosCruce,
                                function (response) {
                                    $('#Permicionarios').jtable('openChildTable', $img.closest('tr'),
                                        {
                                            paging: true,
                                            pageSize: 10,
                                            sorting: false,
                                            columnResizable: false,
                                            animationsEnabled: false,
                                            showCloseButton: false,
                                            actions: {
                                                listAction: window.top.getListPag,
                                            },
                                            fields: {
                                                identificadorEstacion: {
                                                    title: 'Estacion de Servicio'
                                                },
                                                permiso: {
                                                    title: 'Permicionario'
                                                },
                                                razonsocial: {
                                                    title: 'Razon Social'
                                                },
                                                municipio: {
                                                    title: 'Municipio'
                                                },
                                                zona: {
                                                    title: 'Zona'
                                                }
                                            }
                                        }, function cargagrid(data) {
                                            data.childTable.jtable('load', response.responseDataEnumerable);
                                        });
                                }
                            );
                        }
                        else {
                            $(this).children().first().removeClass("fa-angle-up").addClass('fa-angle-down')
                            $('#Permicionarios').jtable('closeChildTable', $img.closest('tr'));
                        }
                    });
                    return $img;
                }
            },
            rfc: {
                title: 'R.F.C.'
            },
            zonas: {
                title: 'Zonas'
            },
            permisionarios: {
                title: 'Permisionarios'
            }
        }
    });
    $('#Permicionarios').jtable('load', datos.responseDataEnumerable);
}

function mostrarZonas(datos) {
    $('#Zonas').jtable({
        paging: true,
        pageSize: 10,
        sorting: false,
        columnResizable: false,
        animationsEnabled: false,
        showCloseButton: false,
        actions: {
            listAction: window.top.getListPag,
        },
        fields: {
            identificador: {
                title: 'Zonas'
            },
            m_valorMagna: {
                width: '15%',
                title: 'Valor Magna'
            },
            m_valorPremium: {
                width: '15%',
                title: 'Valor Premium'
            },
            entidades: {
                width: '50%',
                title: 'Estados aplicados'
            },
            '': {
                width: '15%',
                title: 'Acciones',
                display: function (data) {
                    return '<div i style="width:95%;margin:auto;" ><a href="#ModalActualizar" data-zonavalor="' + data.record.c_zonavalor + '" data-toggle="modal" zona="' + data.record.identificador + '" ><i style="color:black" class="fas fa-edit fa-2x" aria-hidden="true" ></i></a>&nbsp;&nbsp;<a href="#ModalPermicionarios" data-toggle="modal" zona="' + data.record.identificador + '"><i style="color:black" class="fas fa-search fa-2x" aria-hidden="true"></i></a><div>';
                }
            }
        }
    });
    $('#Zonas').jtable('load', datos.responseDataEnumerable);
}

function setAztualizacion(datos) {
    $("#Zona").val(datos.responseDataEnumerable[0].identificador);
    $("#ValorMagna").val(datos.responseDataEnumerable[0].m_valorMagna);
    $("#ValorPremium").val(datos.responseDataEnumerable[0].m_valorPremium);
    $("#entidades").val(datos.responseDataEnumerable[0].entidades);
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


async function ActualizarValorEstimulo(IdValorEstimulo, valorMagna, valorPremium) {
    var response;
    var mensaje;
    var argZonaEstimulo;
    var methodStr = '';
    var urlStr = '';
    var res = validaActualizar();

    if (res === false) {
        return;
    }

    argZonaEstimulo = {
        idValorEstimulo: IdValorEstimulo,
        valorMagna: valorMagna,
        valorPremium: valorPremium,

    };


    try {

        urlStr = '../covol/api/ValorEstimulo/ActualizarValorEstimulo';
        methodStr = 'PUT';

        response = await fetchDataAsync(urlStr, methodStr, JSON.stringify(argZonaEstimulo));

        if (response) {
            sendGet("../covol/api/ValorEstimulo/Zonas", undefined, mostrarZonas);
            window.top.Alerta(response.mensaje, 1);
            $('#ModalActualizar').modal('hide');
        }
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        setCookie("NombrePagina", "valorestimulo.html", 1);
        submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}

function soloNumeros(event) {
    var x = event.which || event.keyCode;
    if (!(((event.keyCode >= 48) && (event.keyCode <= 57)) || event.keyCode == 46
        || event.keyCode == 225 || event.keyCode == 233 || event.keyCode == 237 || event.keyCode == 243 || event.keyCode == 250 || event.keyCode == 193 || event.keyCode == 201 || event.keyCode == 205 || event.keyCode == 211 || event.keyCode == 218
    ))
        event.returnValue = false;
}

function validaActualizar() {
    var isValid = true;
    if ($('#ValorMagna').val().trim() === "") {
        $('#ValorMagna').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#inputClaveProducto').css('border-color', 'lightgrey');
    }
    if ($('#ValorPremium').val().trim() === "") {
        $('#ValorPremium').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#ValorPremium').css('border-color', 'lightgrey');
    }
    return isValid;
}