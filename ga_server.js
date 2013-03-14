var ioClient = require('websocket.io').listen(1337);
var ioManager = require('websocket.io').listen(1338);

var currentTaskJSON = {description : null, scriptURL : null, data : null, params : null};

ioClient.on('connection', function (socket) {
	// A client is given the current active task if there is one
	if(currentTaskJSON)
		socket.emit('runtask', currentTaskJSON);
	// A client sends his best chromosomes and they are broadcasted
	socket.on('best', function (data) {
		socket.broadcast('chromosome', data);
		ioManager.sockets.emit('chromosome', data);
	});
});

ioManager.on('connection', function (socket){
	socket.on('settask', function(data) {
		currentTaskJSON = data;
		ioClient.sockets.emit('runtask', data);
		ioManager.sockets.emit('runtask');		  
	});
	socket.on('stop', function(){
		currentTaskJSON = null;
		ioClient.sockets.emit('stop');
		ioManager.sockets.emit('stop');
	});
});
