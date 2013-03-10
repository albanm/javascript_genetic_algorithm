/**
 * A web worker that uses javascriptgeneticalgorithm.js to run a given task
 */

var _gaRun = null;
 
self.onmessage = function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'runtask':
        if(data.task)
            _run_ga_task(data.task);
        self.postMessage('Run task : ' + data.task && data.task.description);
        break;
    case 'stop':
        if(_gaRun)
            _gaRun.stop();
        self.close();
        self.postMessage('Stop task');
        break;
    case 'setChromosome':
        if(_gaRun && data.chromosome)
            _gaRun.addChromosome(data.chromosome);
        self.postMessage('Received chromosome : ' + data.chromosome);
        break;
    case 'getBest':
        if(_gaRun)
            self.postMessage({'cmd' : 'best', 'chromosome' : _gaRun.best()});
        break;
    default:
      self.postMessage('Unknown command: ' + data.cmd);
  };
};

function _run_ga_task(task){
    importScripts("javascriptgeneticalgorithm.js");
    importScripts(task.scriptURL);
    if(!(GATask && GARun)){
        self.postMessage('No constructor functions GATask() and GARun found in imported scripts');
        return;
    }
    _gaRun = new GARun(new GATask(task.data), task.params);
    _gaRun.run();
}

