var html_dir = './app/views/';

var port = null;

//FUNCIONES PARA EL PUERTO SERIAL
exports.setPort = function(p){
	port = p;
}

var enviarRutaSerial = function(ruta){
	console.log("puntos")
	enviarMensajeSerial("RUTA\n");

	for (var i = 0; i<ruta.length; i++){
		var punto = ruta[i]
		var string = "" + punto.d + ";" + punto.a + "\n";
		enviarMensajeSerial(string);
	}
	enviarMensajeSerial("FIN\n");

}

var enviarMensajeSerial =function(mensaje){
	port.write(mensaje, function(err) {
		    if (err) {
		      return console.log('Error on write: ', err.message);
		    }
		    console.log( mensaje +'mensaje enviado');
	});
}
//FUNCIONES HTTP

exports.getIndex = function(request, response){
	response.render('index');
}

exports.getPrueba = function(request, response){
	response.render('prueba');
}

exports.enviarMensaje = function(request, response){
	var mensaje = request.body.mensaje;
	enviarMensajeSerial(mensaje+'\n');
	response.send({"Status":"OK"});
} 

exports.enviarRuta = function(request, response){
	var puntos = request.body.puntos;
	
	response.send({"Status":"OK"});
	enviarRutaSerial(puntos);
	
}


