var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Vous êtes à l\'accueil, que puis-je pour vous ?');
})
.get('/test', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Ca test bien ! !');
})
.get('/test/:var/test', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Numéro : ' + req.params.var);
})
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(8080);