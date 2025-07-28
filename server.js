"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = require("https");
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
var next_1 = require("next");
var dev = process.env.NODE_ENV !== 'production';
var app = (0, next_1.default)({ dev: dev });
var handle = app.getRequestHandler();
var httpsOptions = {
    key: fs_1.default.readFileSync(path_1.default.resolve('./localhost+2-key.pem')),
    cert: fs_1.default.readFileSync(path_1.default.resolve('./localhost+2.pem')),
};
app.prepare().then(function () {
    https_1.default.createServer(httpsOptions, function (req, res) {
        var _a;
        var parsedUrl = (0, url_1.parse)((_a = req.url) !== null && _a !== void 0 ? _a : "/", true);
        handle(req, res, parsedUrl);
    }).listen(3000, function () {
        console.log('> Ready on https://localhost:3000');
    });
});
