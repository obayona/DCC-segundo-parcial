
var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var swig = require('swig');
var cookieParser = require('cookie-parser');
var fs = require('fs');

var app = express();
var http=require('http').Server(app);



app.use(cookieParser());  
app.use(session({ secret: 'ballnewman',
	resave: false,
	saveUninitialized: true  
}));

//puerto serial
var port = require('./app/serial/serialModule.js');

//router
var routerModule = require('./app/router.js');
routerModule.setPort(port);
var router = routerModule.getRouter();
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


var io = require('socket.io')(http);
var realTimeModule = require("./app/realTime.js")
realTimeModule.serialRealTime(io, port);