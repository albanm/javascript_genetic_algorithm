/**
 * @param points The set of points to connect in a 2 dimensional space, for example [ [0,0], [10,10], [6,6], [5,6]]
 */
function GATask(points){
    this.points = points;

    this.distance = function(a, b) {
        var x = Math.abs(a[0] - b[0]);
        var y = Math.abs(a[1] - b[1]);
        return Math. sqrt(x * x + y * y);
    };

    this.fitness = function(values) {
        var used = [this.points.length];
        var length = 0;
        var previous = values[0];
        var a = this.points[previous];
        used[previous] = 1;
        var b = 0;
        for (var i = 1; i < values.length; ++i) {
            b = this.points[values[i]];
            if (used[values[i]] == 1)
                return 1000;
            length += this.distance(a, b);
            previous = values[i];
            used[previous] = 1;
            a = b;
        }
        return length;
    };
    
    // the size of values that should be passed to fitness
    this.numberOfArgs = function() { return this.points.length; };
    
    // the max value needed for the arguments
    this.maxArg = function() { return this.points.length; };
    
    // convert the current chromosome value which can have a maxValue
    // into something fitness can use.
    this.getArg = function(value, maxValue) {
        return Math.round(value * (this.points.length - 1) / maxValue);
    };

    // Paint the solution onto bestimage
    this.paint = function(values, element) {
        element.innerHTML = "<canvas id='paint_salesman'></canvas>";
        var canvas = document.getElementById('paint_salesman');
        if (canvas.getContext){
            var w = canvas.width;
            var h = canvas.height;
            var canvasContext = canvas.getContext('2d');
            canvasContext.clearRect(0, 0, w, h);

            // draw points
            for (var i = 0; i < this.points.length; ++i){
                var x = this.points[values[i]][0] * 10;
                var y = this.points[values[i]][1] * 10;
                canvasContext.beginPath();
                canvasContext.arc(x, y, 3, 0, Math.PI*2, true);
                canvasContext.fill();
            }
            
            // draw path
            canvasContext.beginPath();
            for (var i = 0; i < this.points.length; ++i){
                var x = this.points[values[i]][0] * 10;
                var y = this.points[values[i]][1] * 10;
                if (i == 0)
                    canvasContext.moveTo(x, y);
                else
                    canvasContext.lineTo(x, y);
            }
            canvasContext.stroke();
        }
    }
}
