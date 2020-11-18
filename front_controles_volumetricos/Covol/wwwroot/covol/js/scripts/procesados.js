window.onload = function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        window.top.LLamarIframe($(e.target).attr("href"));
    });
    pedirPermicionarios();
};
function mostrarCabecera(datos) {
    $('#Cabecera').jtable({
        actions: {
            listAction: window.top.getListData
        },
        fields: {
            DetalleVersion: {
                title: 'Version'
            },
            NumeroPermisoCRE: {
                title: 'No. Permiso CRE'
            },
            RFC: {
                title: 'R.F.C.'
            },
            RfcProveedorSW: {
                title: 'RFC Proveedor'
            },
            NoCertificado: {
                title: 'No. Certificado'
            }
        }
    });
    $('#Cabecera').jtable('load', datos);
}

async function pedirPermicionarios() {
    try {
        var response;
        var FiltrosCruce = {
            "estatus": $("#estatus").val()
        };
        response = await fetchDataAsync("../covol/api/procesados/Permicionarios", "GET", FiltrosCruce);
        data = response;
        console.log(data);
        if (data) {
            mostrarPermicionarios(data);
        }
        //sendGet("../covol/api/procesados/Permicionarios", FiltrosCruce, mostrarPermicionarios);
    }
    catch (error) {
        response = error.responseJSON;
        mensaje = response.mensaje;
        setCookie("NombrePagina", "procesados.html", 1);
        submitOAuthClient();
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
                                "RFC": resultData.record.rfc,
                                "FechaIni": resultData.record.fecInicial,
                                "FechaFin": resultData.record.fecFinal
                            };
                            sendGet('../covol/api/procesados/ConsolidadoMaestro', FiltrosCruce,
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
                title: 'Procesados'
            }
        }
    });
    $('#Permicionarios').jtable('load', datos);
}