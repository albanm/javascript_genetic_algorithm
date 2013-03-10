/**
 * Organize communications between a server of genetic algorithm tasks (through web socket) and a web worker
 */

/**
 * Create a connection to a genetic algorithm tasks server and use a worker to run these tasks
 * @param [object] options
 * @param [string] options.url
 * @param [int] options.loglevel ; -1 : silent, 0 : error, 1 : info, 2 : debug
 */ 
function GAConnection(options){
    this.options = options;
    
    this._create = function(){
        this._checkOptions();
        this.socket = this._connect();
        this.worker = this._createWorker();
        
        this.socket.onmessage = function(e){
            this._logmsg('Server sent: ' + e.data, 2);
            this.worker.postMessage(e.data);
        }
        
        this.worker.onmessage = function(e){
            this._logmsg('Worker sent: ' + e.data, 2);
            this.socket.send(e.data);
        }
    };
    
    this.close = function(){
        if(this.socket)
            this.socket.close();
        if(this.worker){
            this.worker.postMessage({cmd : 'stop'});
            this.worker.close();
        }
    }
    
    this._checkOptions = function(){
        // be silent by default 
        this.options.loglevel = options.loglevel ? options.loglevel : -1;
        if(!this.options.url){
            this._logmsg("No URL in options.", 0);
            return;
        }
        if(this.options.url.indexOf("://") !=-1){
            this._logmsg("URL shoulb be given without scheme. WebSocket scheme will be added by the program.")
            return;
        }
    };
    
    this._logmsg = function(msg, loglevel){
        if(this.options.loglevel >= loglevel){
            if(this.options.logelement && typeof logelement == 'HTMLElement')
                loglement.innerHTML = logelement.innerHTML + '<br/>' + msg;
            else
                console.log(msg);
        }
    };
    
    /**
     * @type WebSocket
     */
    this._connect = function(){
        this._logmsg('WebSocket connection to ' + this.options.url, 1);
        var socket = new WebSocket('ws://' + this.options.url);
        socket.onerror = function (error) {
            this._logmsg('WebSocket error ' + error, 0);
            this.close();
        };
        return socket;
    };
    
    /**
     * @type Worker
     */
    this._createWorker = function(){
        this._logmsg('Worker initialization ', 1);
        var worker = new Worker('ga_worker.js');
        worker.onerror = function (error) {
            this._logmsg('Worker error ' + error, 0);
            this.close();
        };
        return worker;
    };
    
    this._create();
}


