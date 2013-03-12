/**
 * A web worker that uses javascriptgeneticalgorithm.js to run a given task
 */
importScripts("javascriptgeneticalgorithm.js");

var _gaRun = null;
 
self.onmessage = function(e) {
  var data = e.data;
  self.postMessage('Command : ' + data && data.cmd);
  switch (data.cmd) {
    case 'runtask':
        if(data.task){
            importScripts(data.task.scriptURL);
            if(!(GATask)){
                self.postMessage('No constructor function GATask() found in imported script');
            }else{
                _gaRun = new GARun(new GATask(data.task.data), data.task.params);
                _gaRun.run();
            }
        }
        break;
    case 'stop':
        if(_gaRun)
            _gaRun.stop();
        self.close();
        break;
    case 'setChromosome':
        if(_gaRun && data.chromosome)
            _gaRun.addChromosome(data.chromosome);
        break;
    case 'getBest':
        if(_gaRun)
            self.postMessage({'cmd' : 'best', 'chromosome' : _gaRun.best()});
        break;
    default:
      self.postMessage('Unknown command');
  };
};

function _run_ga_task(task){
    
}

/**
 * @param {gaTask} task
 * @param {object} params
 * @param {int} params.populationSize
 * @param {int} params.crossoverRate
 * @param {int} params.mutationRate
 */
function GARun(task, params) {
    this.task = task;
    this.params = params;
    this.active = false;

    if(!(this.params.populationSize && this.params.crossoverRate && this.params.mutationRate ))
        throw("GA parameters are incomplete");
    if (this.params.crossoverRate > 1 || this.params.mutationRate > 1 || this.params.crossoverRate + this.params.mutationRate > 1 )
        throw("cross over and mutation rate combined need to be smaller then 1.0");
    if (this.params.populationSize * this.params.crossoverRate + this.params.mutationRate < 1)
        throw("populationSize * crossoverRate + mutationRate needs to be smaller then 1.0");
    
    this.population = new Population(this.params.populationSize, this.task, this.params.mutationRate, this.params.crossoverRate);
        
    // create a while loop of generations in a non blocking way for letting other events pass
    this._nonBlockingGenerationsLoop = function(){
        var that = this;
        if(this.active){
            this.population.buildNextGeneration();
            setTimeout(function(){that._nonBlockingGenerationsLoop()}, 0);
        }     
    }
    this.run = function(){
        var that = this;
        this.active = true;
        setTimeout(function(){that._nonBlockingGenerationsLoop()}, 0);
    };
    
    
    this.stop = function(){
        this.active = false;
    }
    
    this.best = function(){
        var bestChromosome = this.population.people[0];
        return {args : bestChromosome.args, fitnessValue : bestChromosome.fitnessValue};
    }
    
    this.addChromosome = function(chromosome){
        this.population.people[population.people.length -1] = chromosome;
    }
}


