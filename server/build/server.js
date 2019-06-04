"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var main = require("./main");
var cors = require("cors");
var bodyp = require("body-parser");
var app = express();
app.use(cors());
app.use(bodyp());
app.post('/getData', function (req, res) {
    console.log(req.body);
    res.send(main.runProcess(req.body.progs, req.body.ram, req.body.coefficient * 100, req.body.tasks));
});
app.listen(8080);
