var fs = require('fs');
//se abre el archivo de configuracion
var file = fs.readFileSync('configuration.json', 'utf8')
var configuracion = JSON.parse(file);
var SerialPort = require('serialport');

//se conigura el puerto serial
var puertoSerial = configuracion.serial;
//listadp de puertos seriales
SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});


var port = new SerialPort(puertoSerial,{
	parser: SerialPort.parsers.readline('\n')
});

port.on('open', function() {
	console.log("Puerto abierto");
});

exports.openSerial=function(){
	port = new SerialPort(puertoSerial,{
	parser: SerialPort.parsers.readline('\n')
});
}
//funciones auxiliares
exports.enviarRutaSerial = function(ruta){

	enviarMensajeSerial("RUTA\n");

	for (var i = 0; i<ruta.length; i++){
		var punto = ruta[i]
		var string = "" + punto.lat + ";" + punto.lng + "\n";
		enviarMensajeSerial(string);
	}


}

exports.enviarMensajeSerial =function(mensaje){
	port.write(mensaje, function(err) {
		    if (err) {
		      return console.log('Error on write: ', err.message);
		    }
		    console.log( mensaje +'mensaje enviado');
	});
}



module.exports = port
