/**
 * Organize communications between a server of genetic algorithm tasks (through web socket) and a web worker
 *
 * @param [object] options
 * @param [string] options.serverURL
 * @param [string] options.workerURL
 * @param [int] options.loglevel ; -1 : silent, 0 : error, 1 : info, 2 : debug
 */ 
function GAConnection(options){
    this.options = options;
    this._create();
}

GAConnection.prototype._create = function(){
    if(this._checkOptions()){
        this.socket = this._connect();
        this.worker = this._createWorker();
        this._communicate();
        this._logmsg('Connection initialized', 1);
    }
};
    
GAConnection.prototype.close = function(){
    if(this.socket)
        this.socket.close();
    if(this.worker){
        this.worker.postMessage({cmd : 'stop'});
    }
};
   
GAConnection.prototype._checkOptions = function(){
    // be silent by default 
    this.options.loglevel = this.options.loglevel ? this.options.loglevel : -1;
    if(!this.options.serverURL){
        this._logmsg("No server URL in options.", 0);
        return false;
    }
    if(!this.options.workerURL){
        this._logmsg("No worker URL in options.", 0);
        return false;
    }
    if(this.options.serverURL.indexOf("://") !=-1){
        this._logmsg("Server URL shoulb be given without scheme. WebSocket scheme will be added by the program.", 0)
        return false;
    }
    return true;
};
    
GAConnection.prototype._logmsg = function(msg, loglevel){
    if(this.options.loglevel >= loglevel){
        if(this.options.logelement)
            this.options.logelement.innerHTML = this.options.logelement.innerHTML + '<br/>' + msg;
        else
            console.log(msg);
    }
};
    
/**
 * @type WebSocket
 */
GAConnection.prototype._connect = function(){
    var that = this;
    this._logmsg('WebSocket connection to ' + this.options.serverURL, 1);
    var socket = new WebSocket('ws://' + this.options.serverURL);
    socket.onerror = function (error) {
        that._logmsg('WebSocket error ' + error, 0);
        that.close();
    };
    return socket;
};

/**
 * @type Worker
 */
GAConnection.prototype._createWorker = function(){
    var that = this;
    this._logmsg('Worker initialization ' + this.options.workerURL, 1);
    var worker = new Worker(this.options.workerURL);
    worker.onerror = function (error) {
        that._logmsg('Worker error ' + error, 0);
        that.close();
    };
    return worker;
};
    
/**
 * Organizes communications between the websocket and the worker to transmit tasks, chromosomes, etc.
 */
GAConnection.prototype._communicate = function(){
    this.socket.onmessage = function(e){
        this._logmsg('Server sent: ' + e.data, 2);
        this.worker.postMessage(e.data);
    }
    this.worker.onmessage = function(e){
        this._logmsg('Worker sent: ' + e.data, 2);
        this.socket.send(e.data);
    }
};
    


