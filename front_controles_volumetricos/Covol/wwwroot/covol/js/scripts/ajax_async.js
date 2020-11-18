async function fetchDataAsync(urlString, methodType, args) {
    return await $.ajax({
        contentType: 'application/json',
        url: urlString,
        data: args,
        dataType: 'json',
        type: methodType
    }).then(function (response) {
        console.log(JSON.stringify(response));
        return response;
    });
}

async function uploadFileAsync(urlString, formData) {
    return await $.ajax({
        url: urlString,
        data: formData,
        processData: false,
        contentType: false,
        type: "POST",
     }).then(function (response) {
        console.log(JSON.stringify(response));
        return response;
    });
}
