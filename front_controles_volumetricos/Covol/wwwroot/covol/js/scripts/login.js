$(document).ready(function () {

    $("#btn-iniciarSesion").click(function () {
        window.location.replace("src/layout.html");
        //iniciarSesion($("#inputRFC").val(), $("#inputcontrasenia").val())
    });
});

async function iniciarSesion(usuarioStr, contraseniaStr) {
    var response;
    try {
        response = await fetchDataAsync("../api/usuario/IniciarSesion", "POST",
            JSON.stringify({ usuario: usuarioStr, contrasenia: contraseniaStr }));
        if (response) {
            window.location.replace("src/layout.html");
        }
    } catch (error) {
        console.log(error);
    }
}

function ingresar() {
    window.location.replace("src/layout.html");
    return false;
}