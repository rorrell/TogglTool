var express = require("express");
const basicAuth = require("express-basic-auth");
var request = require('request');
var config = require('config');

var app = express();

app.use(express.static('public'));
var token = config.get('togglApiToken');
var togglAuth = "Basic " + new Buffer.from(token + ":" + 'api_token').toString("base64");

app.get('/index.htm', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
});

app.get('/scripts/jquery-3.3.1.min.js', function (req, res) {
    res.sendFile(__dirname + "/scripts/" + "jquery-3.3.1.min.js");
});

app.get('/todaysentries', function(req, res, next) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var start_date = today.toISOString();
    request({
        url: 'https://www.toggl.com/api/v8/time_entries?start_date=' + start_date,
        headers: {
            "Authorization": togglAuth
        }
    }).pipe(res);
});

var server = app.listen(8081, function() {
    var host = server.address().address === "::" ? "127.0.0.1" : server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});