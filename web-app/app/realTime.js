var data;

exports.serialRealTime = function(io, port){
	port.on('data', function(buffer){
		console.log(buffer);
		//io.emit('currentPosition', buffer);
	})
	io.on('connection', function (socket) {
  		console.log("cliente conectado");
	});
	
};




