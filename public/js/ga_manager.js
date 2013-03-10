/**
 * Connects to a server of genetic tasks to manage it. And run a worker to test tasks locally before broadcasting.
 *
 * @param [object] options
 * @param [string] options.serverURL
 * @param [string] options.workerURL
 * @param [int] options.loglevel ; -1 : silent, 0 : error, 1 : info, 2 : debug
 */ 
function GAManager(options){
    this.options = options;
    // A manager is a connection as defined in ga_client.js but that overrides communications
    this.__proto__ = GAConnection.prototype;
    this._communicate = function(){
        this.socket.onmessage = function(e){
            this._logmsg('Server sent: ' + e.data, 2);
        }
        this.worker.onmessage = function(e){
            this._logmsg('Worker sent: ' + e.data, 2);
        }
    }
    this._create();
}



