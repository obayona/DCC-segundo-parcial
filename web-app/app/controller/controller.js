var SerialPort = require('serialport');
var html_dir = './app/views/';
fs = require('fs');

var file = fs.readFileSync('configuration.json', 'utf8')
var configuracion = JSON.parse(file);
var puertoSerial = configuracion.serial;
var port = new SerialPort(puertoSerial,{
	parser: SerialPort.parsers.readline('\n')
});
port.on('open', function() {
	console.log("Puerto abierto");
});

port.on('data', function(buffer){
	console.log("buffer");
	console.log(buffer);
})

exports.getIndex = function(request, response){
	response.render('index');
}

var enviarRutaSerial = function(ruta){

	enviarMensajeSerial("RUTA\n");

	for (var i = 0; i<ruta.length; i++){
		var punto = ruta[i]
		var string = "" + punto.lat + ";" + punto.lng + "\n";
		enviarMensajeSerial(string);
	}


}

var enviarMensajeSerial =function(mensaje){
	port.write(mensaje, function(err) {
		    if (err) {
		      return console.log('Error on write: ', err.message);
		    }
		    console.log( mensaje +'mensaje enviado');
	});
}

exports.enviarMensaje = function(request, response){
	var mensaje = request.body.mensaje;
	enviarMensajeSerial(mensaje+'\n');
	response.send({"Status":"OK"});
} 

exports.enviarRuta = function(request, response){
	var puntos = request.body.puntos;
	
	response.send({"Status":"OK"});

	console.log(puertoSerial, puntos);
	enviarRutaSerial(puntos);
  	/*port.write("abcdefghijklm567890\n", function(err) {
		    if (err) {
		      return console.log('Error on write: ', err.message);
		    }
		    console.log(' message written');
	});*/

	
}


