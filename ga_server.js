var ioClient = require('socket.io').listen(1337);
var ioManager = require('socket.io').listen(1338);

var currentTaskJSON = {description : null, scriptURL : null, data : null, params : null};

ioClient.sockets.on('connection', function (socket) {
    // A client is given the current active task if there is one
    if(currentTaskJSON)
        socket.emit('runtask', currentTaskJSON);
    // A client sends his best chromosomes and they are broadcasted
    socket.on('best', function (data) {
        socket.broadcast('chromosome', data);
        ioManager.sockets.emit('chromosome', data);
    });
});

ioAdmin.sockets.on('connection', function (socket){
    socket.on('runtask', function(data) {
        currentTaskJSON = data;
        ioClient.sockets.emit('runtask', data);          
    });
    socket.on('stop', function(){
        currentTaskJSON = null;
        ioClient.sockets.emit('stop');
    });
});
