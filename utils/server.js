var http = require('http');
var test = require('./test'); // Fait appel à test.js (même dossier)
// var test = require('../test'); // Fait appel à test.js (dossier parent)
var url = require('url');
var EventEmitter = require('events').EventEmitter;

var EventEmitter = require('events').EventEmitter;
var jeu = new EventEmitter();

jeu.on('gameover', function(message){
    console.log(message);
});

jeu.emit('gameover', 'Vous avez perdu !');

var server = http.createServer(function(req, res) {
    var page = url.parse(req.url).pathname;
    console.log(page);
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write('Bien le bonjour');
	test.direBonjour();
    res.end();
});

server.listen(8080);
