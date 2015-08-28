var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

SQRT_3 = Math.sqrt(3);
PI = Math.PI;

function drawShape(origin, endpoints, fill, scale, rotation) {
    ctx.save();
    ctx.translate(origin[0], origin[1]);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.scale(scale, scale);
    ctx.rotate(rotation);
    endpoints.forEach(function(point) {
        ctx.lineTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function Triangle(shape_params){
    this.origin = shape_params.origin;
    this.scale = shape_params.scale;
    this.rotation = shape_params.rotation;
    this.fill = shape_params.fill || '#fff';
}

Triangle.prototype = {
    drawShape:  function() {
    drawShape(this.origin, this.endpoints, this.fill, this.scale, this.rotation);
    },
    endpoints: [[0, 0], [1, 0], [1/2, SQRT_3/2]],
    rightOffset: [1, 0],
    bottomOffset: [1/2, SQRT_3/2]
};

// var myTriangle = new Triangle([0, 0], 50, 0, 'black');
// myTriangle.drawShape();
// var nextTriangle = new Triangle([50, 0], 50, PI/3, 'red'); //Rotation is clockwise
// nextTriangle.drawShape();
// tile canvas with exactly one shape
function vectorAdd(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]]
}

function scalarMultiply(v, s) {
    return [s*v[0], s*v[1]];
}

function scaleAdd(v1, v2, scale) {
    return [v1[0] + scale * v2[0], v1[1] + scale * v2[1]];
}

function uniformTile(canvas, shape, scale, fill) {
    var rightOrigin = [0, 0];
    var bottomOrigin = [0, 0];
    while (bottomOrigin[0] < canvas.height) {
        while (rightOrigin[0] < canvas.width) {
            // TODO: Change inheritance pattern here
            var nextShape = new shape(rightOrigin, scale);
            rightOrigin = scaleAdd(rightOrigin, rightOffset, scale);
            nextShape.drawShape();
        }
        bottomOrigin = scaleAdd(bottomOrigin, bottomOffset, scale);
        rightOrigin = bottomOrigin;
    }
}

//Tile a canvas given array of tile forms & offset
function compoundTile(canvas, shapes, scale, rightOffset, bottomOffset) {
    var rightOrigin = [0, 0];
    var bottomOrigin = [0, 0];
    while (bottomOrigin[1] < canvas.height) {
        while (rightOrigin[0] < canvas.width) {
            shapes.forEach(function(shapeAndOffset) {
                shape = shapeAndOffset[0];
                offset = shapeAndOffset[1];
                nextShape = new shape(vectorAdd(rightOrigin, offset), scale);
                nextShape.drawShape();
            })
            rightOrigin = vectorAdd(rightOrigin, rightOffset);
        }
        bottomOffset = [-1*bottomOffset[0], bottomOffset[1]]; //Ensure left/right swapping
        bottomOrigin = vectorAdd(bottomOrigin, bottomOffset);
        rightOrigin = bottomOrigin;
    }
}

// //step 1: bound triangles! THEY WORK :)
//
// Using constructor pattern
// REFACTOR - TOO MUCH REPETITION HERE!
var BlackDownTriangle = function(origin, scale) {
    return new Triangle({origin: origin, scale: scale, rotation: 0, fill: 'black'});
};
var BlackUpTriangle = function(origin, scale) {
    return new Triangle({origin: origin, scale: scale, rotation: PI/3, fill: 'black'});
};

var RedUpTriangle = function(origin, scale) {
    return new Triangle({origin: origin, scale: scale, rotation: PI/3, fill: 'red'});
};

var RedDownTriangle = function(origin, scale) {
    return new Triangle({origin: origin, scale: scale, rotation: 0, fill: 'red'});
};

// triangle1 = new BlackTriangle([0, 0], 50);
// triangle1.drawShape();
// triangle2 = new RedTriangle([0, 0], 50);
// triangle2.drawShape();


compoundTile(canvas, [[BlackDownTriangle, [0, 0]], 
                     [ RedUpTriangle , [50, 0]]], 
                     50, [50, 0], [25, 25 * SQRT_3]);
