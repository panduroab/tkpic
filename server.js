var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var moment = require('moment');
var dir = '/tmp/nodejs';

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/files/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, dir);
    form.on('file', function (field, file) {
        fs.rename(file.path, path.join(form.uploadDir, moment().format() + ".png"));
    });
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });
    form.on('end', function () {
        res.end('success');
    });
    form.parse(req);
});

var server = app.listen(8080, function () {
    console.log('Server listening on port 3000');
});