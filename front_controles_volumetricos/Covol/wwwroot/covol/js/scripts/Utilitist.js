$(document).ready(function () {
    //Llama a la función de OAUTH
    submitOAuthClient();

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('#LoadingModal').modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });

    $('#AlertModal').modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });

    $('#PromModal').modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });
});

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
            //LLamarIframe("");
            tokenRequest = await $.ajax({
                url: "../covol/OauthClient/authtoken?code=" + code,
                method: "POST",
                contentType: 'application/x-www-form-urlencoded',
                dataType: "json"
            });
            //token = localStorage.getItem("token_covol");
            token = tokenRequest.access_token;
            deleteCookie("token_covol");
            document.cookie = "token_covol='';secure; HttpOnly";
            document.cookie = "token_covol=" + token;
            base64UrlToken = token.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_').split('.');
            payload = JSON.parse(Base64.decode(base64UrlToken[1]).replace(/\u0000/g, ''));
            rfc = payload.cn;
           //perfilRequest = await fetchDataAsync("../covol/api/Perfil/ObtenerPerfil", "GET", { "rfc": rfc });
            var obtenerPerfil = await fetchDataAsync("../covol/api/Perfil/ObtenerPerfil", "GET", { "rfc": rfc });
            var perfiles = obtenerPerfil.responseDataEnumerable
                .filter(function (item) {
                    return item.rfc == rfc;
                });


            var perfil = perfiles.length ? perfiles[0] : null;
            console.log(perfil);

            if (perfil != null) {
                $("#MenuCarga").css('display', (perfil.carga ? "block" : "none"));
                $("#MenuCatalogos").css('display', (perfil.catalogo ? "block" : "none"));
                $("#MenuCruces").css('display', (perfil.cruce ? "block" : "none"));
                $("#userDropdown").css('display', "block");
                $("#rfc_span").text(rfc);
                LLamarIframe(perfil.carga ? "carga.html" : perfil.cruce ? "cruces.html" : perfil.catalogo ? "catalogos" : "SinPermiso.html");
                var valorCookie = getCookie('NombrePagina');
                if (valorCookie == null | valorCookie == "") {
                    LLamarIframe('carga.html');
                }
                else {
                    LLamarIframe('');
                    LLamarIframe(valorCookie);
                }
                setCookie("NombrePagina", 0, 0);

            } else {
                $("#MenuCarga").css('display', 'none');
                $("#MenuCatalogos").css('display', 'none');
                $("#MenuCruces").css('display', 'none');
                LLamarIframe("SinPermiso.html");
                $("#alert-privilegios").modal('show');
            }

            console.log('RFC', rfc);
            console.log('Perfiles ajax', obtenerPerfil);
            console.log('Perfiles', perfiles);
            console.log('Perfil', perfil);


            //if (!perfilRequest.responseDataEnumerable.length) {
            //    //LLamarIframe("SinPermiso.html");
            //    //$("#MenuCarga").css('display', "none");
            //    //$("#MenuCatalogos").css('display', "none");
            //    //$("#MenuCruces").css('display', "none");
            //    $("#alert-privilegios").modal('show');
            //    //window.top.Alerta("El usuario no tiene los privilegios para el sistema de Controles Volumétricos", 3);
            //} else {
            //    $("#rfc_span").text(rfc);
            //    $("#userDropdown").css('display', "block");
            //    $("#MenuCarga").css('display', "block");
            //    $("#MenuCatalogos").css('display', "block");
            //    $("#MenuCruces").css('display', "block");
            //    //LLamarIframe('carga.html')
            //    var valorCookie = getCookie('NombrePagina');
            //    if (valorCookie == null | valorCookie == "") {
            //        LLamarIframe('carga.html');
            //    }
            //    else {
            //        LLamarIframe('');
            //        LLamarIframe(valorCookie);
            //    }
            //    setCookie("NombrePagina", 0, 0);
            //}
        }
    } catch (error) {
        //LLamarIframe("SinPermiso.html");
        response = error.responseJSON;
        mensaje = response.mensaje;
        window.top.Alerta(mensaje, 3);
    }
}

function submitOAuthClient_res() {
    var code = getParameterByName("code");
    var state = getParameterByName("state");

    if (code == "" && state == "") {
        $("#formOAuthClient").submit();
    } else {
        $.ajax({
            url: "../covol/OauthClient/authtoken?code=" + code,
            method: "POST",
            contentType: 'application/x-www-form-urlencoded',
            dataType: "json"
        }).then(function (data) {
            var token = data.access_token;
            document.cookie = "token_covol=" + token;
            //localStorage.setItem("token_covol", token);
            //document.cookie = "token_covol=eyJraWQiOiI3MTM2OTUyMjQ1MDI5NzUyNjI1MzcxMTQ2MTY1MTQ4OTIxMTQxMTMxNjYzNTkwMjkiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguZGV2LmNsb3VkYi5zYXQuZ29iLm14L25pZHAvb2F1dGgvbmFtIiwianRpIjoiMDQ0NTQ3ZWYtN2Y2Ny00NGZkLTg5MzMtMGIxOTBmYjcxN2FkIiwiYXVkIjoiNzVmMGZhMTgtNjRkNi00NWJmLWFiZjItMmM4NDc5N2Y0ZmExIiwiZXhwIjoxNTc5MjE3NjYwLCJpYXQiOjE1NzkyMTc0ODAsIm5iZiI6MTU3OTIxNzQ1MCwic3ViIjoiODgyZGEyNzJiYTQxOWQ0MjdkODQ4ODJkYTI3MmJhNDEiLCJfcHZ0IjoienQ5YjJsMi9XV20ydm9qanJ6QURmbk1QUUphc3g4K1l5WnVmUkpDTjNBTXc1WTgzdWhDckovZDZPV0F1c3BlNVV0ZGFMeUpiOUc4dFFNSjh2VnBIR2ZHaUdNVjZGV24vWitibXBMazBCMHpzOXNvSDFURXpXYVNqVkdUcm9hd2VIUFV3Mmp1NFdReVRSVHRLckFrVlMySnVpaldlWlRDRXl6YWtWclhMeEUxY3dhM2FnOXZMSm5TVXJZbUx2MElXY1VyNjRuSVpWYXdYblNiTTZBSnRnK2lUOHhNQkd0VjZPeXI2ZEwycG9yUE9PYVg1MG5vTXlvMzFCZEkwS29uS1ZZMkw2T2lBY1Vkem5RMnJwS2lBUUhWS2ZKbE1CNFZQWGpDL3dJdUQrUTFBdytQS3ZWWlNBaTArekNqcGxyeGRjTVpwNlZMN1BGSHAvLzl4SzNTV1dGR0NFb1UzbndlSFZ6dG1od2V5ZlNpV3c0akJIYUZYOThOTGVzaE1GaThLUk1yZy95YTlDS0w2cjgwN3JpZ3NuZlpkZHNPMVpOeWZ4bmVROHBqN0hqaldLdzBwTzBPaSsxMGV4bmxUamxRY2ptYnVlMmZRSmhoS0ZyalN1TkVIS1JNYXNFNnBzSzhvQ25WTDNZYTlhNFlrdGF3eXVoMi8vcVZMVG9rNUVQbW8uNSIsInNjb3BlIjpbImNvdm9sX3BlcmZpbCJdLCJjbiI6IkNBQkE3NDg5IiwiX3RhcmdldCI6ImNvdm9sIn0.HtHWNPtou3t7_sdN0wQUPvYsTwLsxAnXxe6u0frDRttfNeG1nURepk6EqhNXyuXv43h9XSs_jnnrOliyMrp-fqF5RfYiGq1_d7JIOeH38KFiow0e5Bhxf5fuQJe_J17T-r6XB4A7VDnwPQgxmEBrGun5unMbiw8FzK-L2Ek1blnsWydDzNPY3EILO2pIbOQNz95em4b4J_RdxTbbSXSVuGf0lFanB-Jf-JLUKb08Yh0Xh2--7380PnfW8rqP9mGUgZsybCaGyxiOPHINwiBGqOeGyyYAo6VGqG5CONySJ8un6tAwOGRgmOkzjArFOlilfVQpeppZ-0mt8ROhqsvEuQ";
            var token = localStorage.getItem("token_covol");
            var base64Url = token.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_').split('.');
            var header = JSON.parse(Base64.decode(base64Url[0]));
            var payload = JSON.parse(Base64.decode(base64Url[1]).replace(/\u0000/g, ''));
            var _pvt = payload['_pvt'];
            var signature = Base64.decode(base64Url[2]);

            console.log("Header Token", header);
            console.log("Payload Token", payload);
            console.log("Signature token", signature);
            //console.log(_pvt);

        }).catch(function (error) {
            console.log(error);
        });
    }
}

/*async function validaCodigoAutorizacion() {
    try {
        var token = await fetchDataAsync("../covol/")
    } catch (e) {
        console.log(error);
        $("#MenuCarga").css('display', 'none');
        $("#MenuCatalogos").css('display', 'none');
        $("#MenuCruces").css('display', 'none');
        LLamarIframe("SinPermiso.html");
        var obj = error.responseJSON;
        var er = obj.mensaje;
        window.top.Alerta(error.statusText + ': ' + er, 3);
    }
}*/

async function validaheader() {
    try {
        var dataValidaPerfil = await fetchDataAsync("/api/Perfil/ValidaPerfil", "GET", {});
        var rfc = dataValidaPerfil.rfc;
        var obtenerPerfil = await fetchDataAsync("/api/Perfil/ObtenerPerfil", "GET", {});
        var perfiles = obtenerPerfil.responseDataEnumerable
            .filter(function (item) {
                return item.rfc == rfc;
            });


        var perfil = perfiles.length ? perfiles[0] : null;
        console.log(perfil);

        if (perfil != null) {
            $("#MenuCarga").css('display', (perfil.carga ? "block" : "none"));
            $("#MenuCatalogos").css('display', (perfil.catalogo ? "block" : "none"));
            $("#MenuCruces").css('display', (perfil.cruce ? "block" : "none"));

            LLamarIframe(perfil.carga ? "carga.html" : perfil.cruce ? "cruces.html" : perfil.catalogo ? "catalogos" : "SinPermiso.html");
        } else {
            $("#MenuCarga").css('display', 'none');
            $("#MenuCatalogos").css('display', 'none');
            $("#MenuCruces").css('display', 'none');
            LLamarIframe("SinPermiso.html");
        }

        console.log('RFC', rfc);
        console.log('Perfiles ajax', obtenerPerfil);
        console.log('Perfiles', perfiles);
        console.log('Perfil', perfil);
    } catch (error) {
        console.log(error);
        $("#MenuCarga").css('display', 'none');
        $("#MenuCatalogos").css('display', 'none');
        $("#MenuCruces").css('display', 'none');
        LLamarIframe("SinPermiso.html");
        var obj = error.responseJSON;
        var er = obj.mensaje;
        window.top.Alerta(error.statusText + ': ' + er, 3);
    }
}

function LLamarIframe(src) {
    top.document.getElementById('TOTO').setAttribute("src", src);
}
function mostrarLoading() {
    $("#LoadingModal").modal('show');
}
function ocultarLoading() {
    $("#LoadingModal").modal('hide');
}
function Alerta(mensaje, nivel) {
    ocultarLoading();
    $("#AlertModal").clone().removeAttr("id").attr("id", "AlertModalClon").insertAfter("#AlertModal");
    $("#AlertModalClon").on('hidden.bs.modal', function (e) {
        $("#AlertModalClon").remove();
    });
    $("#AlertModalClon h3").text(mensaje);
    switch (nivel) {
        case 1:
            $("#AlertModalClon .modal-header").removeAttr("Class").attr("Class", "modal-header  bg-info");
            $("#AlertModalClon i").removeAttr("Class").attr("Class", "fas fa-info-circle fa-7x text-info");
            break;
        case 2:
            $("#AlertModalClon .modal-header").removeAttr("Class").attr("Class", "modal-header bg-warning");
            $("#AlertModalClon i").removeAttr("Class").attr("Class", "fas fa-exclamation-triangle fa-7x text-warning");
            break;
        case 3:
            $("#AlertModalClon .modal-header").removeAttr("Class").attr("Class", "modal-header bg-danger");
            $("#AlertModalClon i").removeAttr("Class").attr("Class", "fas fa-times-circle fa-7x text-danger");
            break;
    }
    $("#AlertModalClon").modal('show');
    return true;
}

function Preguntar(mensaje, nivel, callBack) {
    ocultarLoading();
    $("#PromModal").clone().removeAttr("id").attr("id", "pregunsta").insertAfter("#PromModal");
    $("#pregunsta").on('hidden.bs.modal', function (e) {
        $("#pregunsta").remove();
    });
    $("#pregunsta h3").html(mensaje);
    switch (nivel) {
        case 1:
            $("#pregunsta .modal-header").removeAttr("Class").attr("Class", "modal-header  bg-info");
            $("#pregunsta i").removeAttr("Class").attr("Class", "fas fa-info-circle fa-7x text-info");
            break;
        case 2:
            $("#pregunsta .modal-header").removeAttr("Class").attr("Class", "modal-header bg-warning");
            $("#pregunsta i").removeAttr("Class").attr("Class", "fas fa-exclamation-triangle fa-7x text-warning");
            break;
        case 3:
            $("#pregunsta .modal-header").removeAttr("Class").attr("Class", "modal-header bg-danger");
            $("#pregunsta i").removeAttr("Class").attr("Class", "fas fa-times-circle fa-7x text-danger");
            break;
    }
    if (callBack !== undefined)
        $("#pregunsta #btnAccion").click(callBack);
    $("#pregunsta").modal('show');
    return false;
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
function getListData(postData, jtParams) {
    var ret;
    return $.Deferred(function ($dfd) {
        ret = {
            'Result': "OK",
            'Records': postData,
            'TotalRecordCount': postData.length
        };
        $dfd.resolve(ret);
    });
}
function getListPag(postData, jtParams) {
    var ret;
    var pagina = jtParams.jtStartIndex == 0 ? 1 : (jtParams.jtStartIndex / jtParams.jtPageSize) + 1
    var limite = jtParams.jtPageSize * pagina
    var reg = new Array();
    for (var i = jtParams.jtStartIndex; i < limite; i++) {
        if (i < postData.length)
            reg.push(postData[i]);
        else
            break;
    }
    return $.Deferred(function ($dfd) {
        ret = {
            'Result': "OK",
            'Records': reg,
            'TotalRecordCount': postData.length
        };
        $dfd.resolve(ret);
    });
}
function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}
