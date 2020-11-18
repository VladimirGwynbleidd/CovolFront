window.onload = function () {

    $("#FecIni, #FecFin").datepicker({
        language: 'es',
        autoclose: true,
        format: "dd/MM/yyyy",       
        startDate: "-2y",
        endDate: "+3y",
    });

    $("#FecIni, #FecFin").datepicker();

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        window.top.LLamarIframe($(e.target).attr("href"));
    });
    $("#accordion").accordion({
        collapsible: true
    });

    cargarProductos();
};

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
		setCookie("NombrePagina", "reportes.html", 1);
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


async function rptCrucero() {
  
    if (!abrirModalFechas()) {
        return;
    }
  
    var FiltrosCruce = {
        "RFC": $("#txtRFC").val(),
        "NoCRE": $("#txtNoCRE").val(),
        "TipodeRegistro": $("#tipoRegistro").val(),
        "TipoProducto": $("#Productos").val(),
        "FechaIni": window.top.convertDate($("#FecIni").datepicker("getDate")),
        "FechaFin": window.top.convertDate($("#FecFin").datepicker("getDate"))
    };
    //sendGet("../covol/api/reportes/Permicionarios", FiltrosCruce, mostrarResultados);
  try {
        var response;
        response = await fetchDataAsync("../covol/api/reportes/Permicionarios", "GET", FiltrosCruce);
        data = response;
        console.log(data);
        if (data) {
            mostrarResultados(data);
          $('#accordion').accordion({
        		active: 1
    		});
        }
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        setCookie("NombrePagina", "reportes.html", 1);
      	submitOAuthClient();
    }
    
}

function abrirModalFechas() {

    var NoCRE = $('#txtNoCRE').val();

    if (NoCRE == null || NoCRE == "") {
        window.top.Alerta("Ingrese el número de la CRE", 3);
        return false;
    }

    var fechaI = $('#FechaInicio').val();
    var fechaF = $('#FechaFin').val();


    if (fechaI == null || fechaI == "") {
        window.top.Alerta("Ingrese una fecha de Inicio", 3);
        return false;
    }

    if (fechaF == null || fechaF == "") {
        window.top.Alerta("Ingrese una fecha fin", 3);
        return false;
    }

    var fechaInicio = $('#FechaInicio').val().split('/');
    var MesInicio = monthNameToNum(fechaInicio[1])
    var c = fechaInicio[0].toString() + '/' + MesInicio.toString() + '/' + fechaInicio[2].toString();


    var fechaFinal = $('#FechaFin').val().split('/');
    var MesFinal = monthNameToNum(fechaFinal[1].toString());
    var fechaFinalCompleto = new Date(fechaFinal[0].toString() + '/' + MesFinal.toString() + '/' + fechaFinal[2].toString());



    var begD = new Date(fechaInicio[2], MesInicio - 1, fechaInicio[0]);
    var endD = new Date(fechaFinal[2], MesFinal - 1, fechaFinal[0]);


    if (begD > endD) {
        window.top.Alerta("La fecha de inicio no puede ser mayor a la fecha fin", 3);

        return false;
    }
    else if (endD < begD) {
        window.top.Alerta("La fecha fin no puede ser menor a la fecha de inicio", 3);

        return false;
    }
    else { return true }
}


function monthNameToNum(monthname) {
    var month = data.indexOf(monthname);
    var mesCompleto = parseInt(month) + 1
    if (mesCompleto.toString().length == 1) {
        mesCompleto = '0' + mesCompleto;

    }
    return mesCompleto;
}
var data = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")


function mostrarResultados(datos) {
    $('#Resultados').jtable({
        actions: {
            listAction: window.top.getListData
        },
        fields: {
            '': {
                title: 'Ver Detalle',
                width: '2%',
                sorting: false,
                display: function (resultData) {
                    var $img = $('<div style="width:20%;margin:auto;" > <i class="fas fa-angle-down fa-2x text-gray-300"></i><div>');
                    $img.click(function (e) {
                        if ($(this).children().first().hasClass('fa-angle-down')) {
                            $(this).children().first().removeClass("fa-angle-down").addClass('fa-angle-up');
                            var FiltrosCruce = {
                                "RFC": resultData.record.rfc,
                                "TipoProducto": $("#Productos").val(),
                                "TipodeRegistro": $("#tipoRegistro").val(),
                              	"NoCRE": $("#txtNoCRE").val(),
                                "FechaIni": window.top.convertDate(resultData.record.fecInicialOper),
                                "FechaFin": window.top.convertDate(resultData.record.fecFinalOper)
                            };
                            sendGet('../covol/api/reportes/MovimientosConsolidados', FiltrosCruce,
                                function (response) {
                                    $('#Resultados').jtable('openChildTable', $img.closest('tr'),
                                        {
                                            sorting: false,
                                            columnResizable: false,
                                            animationsEnabled: false,
                                            showCloseButton: false,
                                            actions: {
                                                listAction: window.top.getListData,
                                            },
                                            fields: {
                                                '': {
                                                    title: 'Generar Reporte',
                                                    width: '5%',
                                                    sorting: false,
                                                    display: function (data) {
                                                        return '<div class="center-block text-center"><a class="text-success text-center" href="javascript:exportToExcel(\'' + data.record.rfc + '\',\'' + data.record.numeroPermisoCRE + '\',\'' + window.top.convertDate(data.record.fechaCorte) + '\',\'' + window.top.convertDate(data.record.fechaCarga) + '\')"><i class="fas fa-file-excel fa-2x text-gray-300"></i></a></div>';
                                                    }
                                                },
                                                numeroPermisoCRE: {
                                                    title: 'Permiso CRE'
                                                },
                                                fechaCorte: {
                                                    title: 'Periodo',
                                                    width: '10%',
                                                    type: 'date',
                                                    displayFormat: 'MM'
                                                }
                                            }
                                        }, function cargagrid(data) {
                                            data.childTable.jtable('load', response);
                                        });
                                });
                        }
                        else {
                            $(this).children().first().removeClass("fa-angle-up").addClass('fa-angle-down');
                            $('#Resultados').jtable('closeChildTable', $img.closest('tr'));
                        }
                    });
                    return $img;
                }
            },
            rfc: {
                title: 'R.F.C.'
            },
            periodo: {
                title: 'Periodo',
                width: '10%',
                display: function (resultData) {
                    return "Del " + window.top.convertDate(resultData.record.fecInicialOper) + " al " + window.top.convertDate(resultData.record.fecFinalOper);
                }
            },
            archivos: {
                title: 'Achivos procesados'
            }
        }
    });
    $('#Resultados').jtable('load', datos);
}
function exportToExcel(r, c, fi, ff) {
    console.log(r);
    console.log(c);
    console.log(fi);
    console.log(ff);
    var tipoRegistro = $("#tipoRegistro option:selected").text();
    var productos = $("#Productos option:selected").text();

    var FiltrosCruce = {
        RFC: r,
        NoCRE: c,
        TipodeRegistro: tipoRegistro,
        TipoProducto: productos,
        FechaIni: fi,
        FechaFin: ff
    };
    var queryString = $.param(FiltrosCruce);
    var curAddr = "../covol/api/Reportes/reporte?" + queryString;
    //window.open(curAddr, "");
    window.location.href = curAddr;
    $('#mdlReporte').modal('hide');
}

function soloLetrasYNumeros(event) {
    var x = event.which || event.keyCode;
    if (!(((event.keyCode >= 97) && (event.keyCode <= 122)) || ((event.keyCode >= 65) && (event.keyCode <= 90)) || ((event.keyCode >= 48) && (event.keyCode <= 57))
        || event.keyCode == 225 || event.keyCode == 233 || event.keyCode == 237 || event.keyCode == 243 || event.keyCode == 250 || event.keyCode == 193 || event.keyCode == 201 || event.keyCode == 205 || event.keyCode == 211 || event.keyCode == 218
        || event.keyCode == 32
    ))
        event.returnValue = false;
}

function soloLetrasYNumerosCRE(event) {
    var x = event.which || event.keyCode;
    if (!(((event.keyCode >= 97) && (event.keyCode <= 122)) || ((event.keyCode >= 65) && (event.keyCode <= 90)) || ((event.keyCode >= 48) && (event.keyCode <= 57)) || event.keyCode == 47
        || event.keyCode == 225 || event.keyCode == 233 || event.keyCode == 237 || event.keyCode == 243 || event.keyCode == 250 || event.keyCode == 193 || event.keyCode == 201 || event.keyCode == 205 || event.keyCode == 211 || event.keyCode == 218
        || event.keyCode == 32
    ))
        event.returnValue = false;
}