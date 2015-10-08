'use strict';

var express = require ('express');
var favicon = require('express-favicon');
var app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.static(__dirname ));

app.get("/", function(req, res){
  res.render("index");
});


app.listen(process.env.PORT || 5000);
