var SerialPort = require('serialport');


var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var swig = require('swig');
var cookieParser = require('cookie-parser');
var fs = require('fs');

var app = express();
var http=require('http').Server(app);

SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

//redis
//var redis = require('redis');
//var client = redis.createClient();
/*
var redisStore=require('connect-redis')(session);

var sessionMiddleware = session({
	secret: 'bobneuman',
	store: new redisStore({
			host:'localhost',
			port: 6379,
			client:client,
			disableTTL: true}),
	saveUninitialized: false,
	resave: false
});

app.use(sessionMiddleware);*/
app.use(cookieParser());  
app.use(session({ secret: 'ballnewman',
	resave: false,
	saveUninitialized: true  
}));

//router
var router=require('./app/router.js');


//cargar parametros de configuracion
var file = fs.readFileSync('configuration.json', 'utf8')
var configuracion = JSON.parse(file);


app.set('port', configuracion.puerto);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'siggatocanegra'}));

/*Statics*/
app.use(express.static('./app/public'));
/*Template engine*/
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');
app.use('/',router);



http.listen(app.get('port'),function(){
    console.log("DRisk Aplication running in a port " + app.get('port'));
});