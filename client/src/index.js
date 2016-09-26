var server = "http://127.0.0.1:8080/api/";
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');

function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
}

function takePicture() {
    context.drawImage(video, 0, 0, 640, 480);
    var dataURL = canvas.toDataURL();
    var blob = base64ToBlob(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""), 'image/png');
    var formData = new FormData();
    formData.append('file', blob);

    $.ajax({
        type: "POST",
        url: server + "files/upload",
        data: formData,
        cache: false,
        contentType: false,
        processData: false
    }).done(function (o) {
        console.log(o)
    });
}

function startTaken() {
    window.setInterval(takePicture, 1000);
}

document.getElementById("snap").addEventListener("click", takePicture);
document.getElementById("start").addEventListener("click", startTaken);

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(function (stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    }).catch(function (error) {
        console.log("error", error);
    })
}