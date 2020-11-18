"use strict";
var selDiv = "";
var storedFiles = [];
; (function (document, window, index) {
    // feature detection for drag&drop upload
    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();
    // applying the effect for every form
    var forms = document.querySelectorAll('.box');
    Array.prototype.forEach.call(forms, function (form) {
        var input = form.querySelector('input[type="file"]'),

            errorMsg = form.querySelector('.box__error span'),
            restart = form.querySelectorAll('.box__restart'),
            droppedFiles = false,
            showFiles = function (files) {
                var tags = ["text/plain", "text/xml"];
                //c $("#tbArchivos tbody").empty();
                //c $("#smlElemntos").empty();
                var contador = 0;
                for (var i = 0; i < files.length; i++) {
                    if (tags.indexOf(files[i].type) < 0) {
                        //c  $("#tbArchivos tbody").empty();
                        agregarArchivo("Se encontro un archivo no valido", 1);
                        break;
                    } else {
                        var nombre = files[i].name;
                        var tamanio = files[i].size;

                        agregarArchivo(nombre, tamanio);
                        contador++;
                    }
                }

                
                var table = document.getElementById("tbArchivos");
                var tr = table.getElementsByTagName("tr");

                

                $("#smlElemntos").empty().text("Se han agregado " + (tr.length - 1) + " archivos");

                setCookie("ArchivosPorSubir", tr.length - 1, 1);

                var valorArchivoCompletos = getCookie('ArchivoCompletos');
                var valorArchivosPorSubir = getCookie('ArchivosPorSubir');
                var suma = parseInt(valorArchivosPorSubir) + parseInt(valorArchivoCompletos);


            },
            triggerFormSubmit = function () {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('submit', true, false);
                form.dispatchEvent(event);
            };
        // letting the server side to know we are going to make an Ajax request
        var ajaxFlag = document.createElement('input');
        ajaxFlag.setAttribute('type', 'hidden');
        ajaxFlag.setAttribute('name', 'ajax');
        ajaxFlag.setAttribute('value', 1);
        form.appendChild(ajaxFlag);
        // automatically submit the form on file select
        input.addEventListener('change', function (e) {
            showFiles(e.target.files);
        });
        // drag&drop files if the feature is available
        if (isAdvancedUpload) {
            form.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser
            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                form.addEventListener(event, function (e) {
                    // preventing the unwanted behaviours
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            ['dragover', 'dragenter'].forEach(function (event) {
                form.addEventListener(event, function () {
                    form.classList.add('is-dragover');
                });
            });
            ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                form.addEventListener(event, function () {
                    form.classList.remove('is-dragover');
                });
            });
            form.addEventListener('drop', function (e) {
                droppedFiles = e.dataTransfer.files; // the files that were dropped
                showFiles(droppedFiles);
            });
        }
        // if the form was submitted
        form.addEventListener('submit', function (e) {
            // preventing the duplicate submissions if the current one is in progress
            if (form.classList.contains('is-uploading')) return false;
            form.classList.add('is-uploading');
            form.classList.remove('is-error');
            if (isAdvancedUpload) // ajax file upload for modern browsers
            {
                e.preventDefault();
                // gathering the form data
                var ajaxData = new FormData(form);
                if (droppedFiles) {
                    Array.prototype.forEach.call(droppedFiles, function (file) {
                        ajaxData.append(input.getAttribute('name'), file);
                    });
                }
                // ajax request
                var ajax = new XMLHttpRequest();
                ajax.open(form.getAttribute('method'), form.getAttribute('action'), true);
                ajax.onload = function () {
                    form.classList.remove('is-uploading');
                    if (ajax.status >= 200 && ajax.status < 400) {
                        var data = JSON.parse(ajax.responseText);
                        form.classList.add(data.success == true ? 'is-success' : 'is-error');
                        if (!data.success) errorMsg.textContent = data.error;
                        borrarTodo();
                    } else {
                        borrarTodo();
                        alert('Error. Please, contact the webmaster!')
                    };
                };
                ajax.onerror = function () {
                    borrarTodo();
                    form.classList.remove('is-uploading');
                    alert('Error. Please, try again!');
                };
                ajax.send(ajaxData);
            } else // fallback Ajax solution upload for older browsers
            {
                var iframeName = 'uploadiframe' + new Date().getTime(),
                    iframe = document.createElement('iframe');
                $iframe = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');
                iframe.setAttribute('name', iframeName);
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                form.setAttribute('target', iframeName);
                iframe.addEventListener('load', function () {
                    var data = JSON.parse(iframe.contentDocument.body.innerHTML);
                    form.classList.remove('is-uploading')
                    form.classList.add(data.success == true ? 'is-success' : 'is-error')
                    form.removeAttribute('target');
                    if (!data.success) errorMsg.textContent = data.error;
                    iframe.parentNode.removeChild(iframe);
                });
            }
        });
        // restart the form if has a state of error/success
        Array.prototype.forEach.call(restart, function (entry) {
            entry.addEventListener('click', function (e) {
                e.preventDefault();
                form.classList.remove('is-error', 'is-success');
                input.click();
            });
        });
        // Firefox focus bug fix for file input
        input.addEventListener('focus', function () {
            input.classList.add('has-focus');
        });
        input.addEventListener('blur', function () {
            input.classList.remove('has-focus');
        });
    });
}(document, window, 0));

function agregarArchivo(nombre, tamanio) {
    tamanio /= 1024000;
    var strTamanio = tamanio < 1 ? "< 1 " : tamanio.toFixed(2);
    var markup = "<tr><td>" + nombre + "</td><td>" + strTamanio + "Mb</td><td>0.0%</td><td>Pendiente</td><td><a class='btn btn-danger' href=\"javascript:borrarArchivo('" + nombre + "')\"><span class='fas fa-trash fa-lg' aria-hidden='true'></span></a></td></tr>";
    $("#tbArchivos tbody").append(markup);
    $("#Archivos .card-footer").show();
    //  $("#drag_box")[0].reset();
}
function borrarArchivo(archivo) {
    window.top.Preguntar("&iquest;Seguro que desea quitar el archivo?", 3, function () {
        var obj = $("#file");
        var archivos = obj[0].files;
        for (var i = 0; i < archivos.length; i++) {
            if (archivos[i].name === archivo) {
                obj.push(archivos[i]);
                break;
            }
        }
        removerFila(archivo);
        $("#drag_box")[0].reset();
    });
}
function removerFila(filter) {
    var table, tr, td, txtValue;
    table = document.getElementById("tbArchivos");
    tr = table.getElementsByTagName("tr");
    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.indexOf(filter) > -1) {
                tr[i].remove();
                break;
            }
        }
    }
    tr = table.getElementsByTagName("tr");
    if (tr.length < 2)
        $("#Archivos .card-footer").hide();

    $("#smlElemntos").empty().text("Se han agregado " + (tr.length - 1) + " archivos");
    return true;
}
function borrarTodo() {
    window.top.Preguntar("&iquest;Seguro que desea quitar todos los archivos?", 3, function () {
        var obj = $("#file");
        var archivos = obj[0].files;
        for (var i = 0; i < archivos.length; i++) {
            removerFila(archivos[i].name);
            obj.push(archivos[i]);
        }
        $("#Archivos .card-footer").hide();
        $("#smlElemntos").empty();
        $("#tbArchivos tbody").empty();
    });
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}