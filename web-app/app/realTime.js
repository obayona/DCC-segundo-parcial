

exports.serialRealTime = function(io, port){
	port.on('data', function(buffer){
		console.log("buffer");
		console.log(buffer);
		io.emit('message', buffer);
	})
	
};


