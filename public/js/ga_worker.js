/**
 * A web worker that uses javascriptgeneticalgorithm.js to run a given task
 */
self.onmessage = function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'runtask':
        _run_ga_task(data.task);
        break;
    case 'stop':
        _if(_gaRun)
            _gaRun.stop();
        self.close();
        break;
    case 'setIndividual':
        if(_gaRun && individual)
            _gaRun.addIndividual();
        break;
    case 'getBest':
        if(_gaRun)
            self.postMessage('best', _gaRun.best());
        break;
    default:
      self.postMessage('Unknown command: ' + data.cmd);
  };
};

var _gaRun = null;

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

