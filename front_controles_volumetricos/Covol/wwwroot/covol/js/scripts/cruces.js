window.onload = function () {
    $("#mdlReporte").on('show.bs.modal', function (e) {
        rptCrucero($(e.relatedTarget).attr("rfc"), $(e.relatedTarget).attr("fecha"), $(e.relatedTarget).attr("numerocre"));
        $("#btnProcesar").attr("rfc", $(e.relatedTarget).attr("rfc"));
        $("#btnProcesar").attr("numerocre", $(e.relatedTarget).attr("numerocre"));
    }); 
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        window.top.LLamarIframe($(e.target).attr("href"));
    });
    pedirPermicionarios();

    
    //VerificarArchivosProcesados();
};



async function rptCrucero(rfc, fecha, NoCRE) {
    try {
        var response;
        var FiltrosCruce = {
            "RFC": rfc,
            "NoCRE": NoCRE,
            "FechaIni": fecha,
            "FechaFin": fecha
        };
        
        response = await fetchDataAsync("../covol/api/cruces/ConsolidadoMaestro", "GET", FiltrosCruce);
        data = response;
        console.log(data);
        if (data) {
            mostrarConsolidado(data);
        }
        //sendGet("../covol/api/cruces/ConsolidadoMaestro", FiltrosCruce, mostrarConsolidado);
    } catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        setCookie("NombrePagina", "cruces.html", 1);
        submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}



async function pedirPermicionarios() {
    try {
        var response;
        var FiltrosCruce = {
            "estatus": $("#estatus").val()
        };

        response = await fetchDataAsync("../covol/api/cruces/Permicionarios", "GET", FiltrosCruce);
        data = response;
        console.log(data);
        if (data) {
            mostrarPermicionarios(data);
        }

        //sendGet("../covol/api/cruces/Permicionarios", FiltrosCruce, mostrarPermicionarios);
    }
    catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        setCookie("NombrePagina", "cruces.html", 1);
        submitOAuthClient();
        //window.top.Alerta(mensaje, 3);
    }
}



 async function VerificarArchivosProcesados() {

     try {
         var response;
         response = await fetchDataAsync("../covol/api/cruces/VerificarArchivosProcesados", "GET", {});
         data = response;
         console.log(data);
         if (data) {
             window.top.Alerta(data, 1);
             pedirPermicionarios();
             setCookie('ArchivoCompletos', '', 0)
             setCookie('ArchivosPorSubir', '', 0)
         }

     } catch (error) {
         response = error.responseJSON;
         mensaje = response.mensaje;
         setCookie("NombrePagina", "cruces.html", 1);
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

function mostrarPermicionarios(datos) {
    $('#Permicionarios').jtable({
        actions: {
            listAction: window.top.getListData
        },
        fields: {
            '': {
                title: '',
                width: '2%',
                sorting: false,
                display: function (resultData) {
                    var $img = $('<div style="width:20%;margin:auto;" > <i class="fas fa-angle-down fa-2x text-gray-300"></i><div>');
                    $img.click(function (e) {
                        if ($(this).children().first().hasClass('fa-angle-down')) {
                            $(this).children().first().removeClass("fa-angle-down").addClass('fa-angle-up');
                            var FiltrosCruce = {
                                "rfc": resultData.record.rfc,
                                "numeroPermisoCRE": resultData.record.numeroPermisoCRE,
                                "estatus": $("#estatus").val()
                            };
                            sendGet('../covol/api/cruces/Consolidados', FiltrosCruce,
                                function (response) {
                                    $('#Permicionarios').jtable('openChildTable', $img.closest('tr'),
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
                                                    title: '',
                                                    width: '5%',
                                                    sorting: false,
                                                    display: function (data) {
                                                        return '<div class="center-block text-center"><a class="text-success text-center" href="#mdlReporte" data-toggle="modal" fecha="' + data.record.fechaCarga + '" rfc="' + data.record.rfc + '"numerocre="' + data.record.numeroPermisoCRE + '"><i class="fas fa-file-excel fa-2x text-gray-300"></i></a></div>';
                                                    }
                                                },
                                                fechaCorte: {
                                                    title: 'Fecha de Corte',
                                                    width: '20%',
                                                    type: 'date',
                                                    displayFormat: 'MM'
                                                },
                                                fechaCarga: {
                                                    title: 'Fecha de Carga',
                                                    width: '20%',
                                                    type: 'date',
                                                    displayFormat: 'dd/mm/yyyy'
                                                },
                                                archivos: {
                                                    width: '20%',
                                                    title: 'Archivos pendientes'
                                                },
                                                'vacio': {
                                                    title: '',
                                                    width: '65%',
                                                }
                                            }
                                        }, function cargagrid(data) {
                                            data.childTable.jtable('load', response);
                                        });
                                });
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
            periodo: {
                title: 'Periodo',
                width: '10%',
                display: function (resultData) {
                    return "Del " + window.top.convertDate(resultData.record.fecInicial) + " al " + window.top.convertDate(resultData.record.fecFinal);
                }
            },
            numeroPermisoCRE: {
                title: 'No. Permiso CRE'
            },
            archivos: {
                title: 'Pendientes'
            }
        }
    });
    $('#Permicionarios').jtable('load', datos);
}
function mostrarConsolidado(datos) {
    $('#Consolidado').jtable({
        title: 'Registro de Consolidado',
        actions: {
            listAction: window.top.getListData
        },
        fields: {
            numeroPermisocre: {
                title: 'CRE'
            },
            tipoGasolina: {
                title: 'Gasolina'
            },
            litrosdeVenta: {
                title: 'Litros',
                display: function (data) {
                    return data.record.litrosdeVenta.toFixed(2);
                }
            },
            total: {
                title: 'Total',
                display: function (data) {
                    return data.record.total.toFixed(2);
                }
            },
            ltsExcedentes: {
                title: 'Litros Exc',
                display: function (data) {
                    return data.record.ltsExcedentes.toFixed(2);
                }
            },
            ltsEtimad: {
                title: 'Litros Est',
                display: function (data) {
                    return data.record.ltsEtimad.toFixed(2);
                }
            },
            montoEstimulo: {
                title: 'Monto Est',
                display: function (data) {
                    return data.record.ltsEtimad.toFixed(2);
                }
            },
            valorEst: {
                title: 'Valor Est',
                display: function (data) {
                    return data.record.valorEst.toFixed(2);
                }
            },
        }
    });
    $('#Consolidado').jtable('load', datos);
}
function exportTableToExcel() {
    window.top.Preguntar("Se procesara la informaci&oacute;n con los archivos cargados hasta el momento <br\> &iquest;Desea procesar el cruce?", 2, function () {
        var FiltrosCruce = {
            "rfc": $("#btnProcesar").attr("rfc"),
            "NoCRE": $("#btnProcesar").attr("numerocre"),
            "FechaIni": "01/01/1999",
            "FechaFin": "01/01/2050"
        };
        var queryString = $.param(FiltrosCruce);
        window.location.href = "../covol/api/Cruces/reporte?" + queryString;
        $('#mdlReporte').modal('hide');
        setTimeout(function () { pedirPermicionarios(); }, 3333);
    });
    $('#mdlReporte').modal('hide');
}