import glMatrix from 'gl-matrix';

document.body.style.height = "100%";
document.body.style.overflow = "hidden";
document.body.style.margin = "0";

document.documentElement.style.height = "100%";
document.documentElement.style.overflow = "hidden";

var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');

var rect1 = new paper.Rect(100,100,200,200);
var rect2 = new paper.Rect(200,300,200,200);
rect2.fill = 'green';
var table = new paper.Table();

table.add(rect1);
table.add(rect2);

Number.prototype.toRadians = function() {
    return Math.PI * this / 180;
};

var angle = 20;
console.log(glMatrix.mat2d.identity([]));

function rotateAroundPoint(point, angle) {
    var [tx, ty] = point;
    var rot = glMatrix.mat2d.rotate([], glMatrix.mat2d.identity([]), angle);
    var m = glMatrix.mat2d.identity([]);
    glMatrix.mat2d.translate(m, m, [-tx, -ty]);
    glMatrix.mat2d.mul(m, rot, m);
    glMatrix.mat2d.translate(m, m, [tx, ty]);
    return m;
}

[rect1, rect2].forEach(rect => {
    var [  ,  ,  ,  ,  tx, ty] = rect.transform;
    var m = rotateAroundPoint([tx, ty], angle.toRadians());
    glMatrix.mat2d.mul(rect.transform, m, rect.transform);
});

table.draw(ctx);

var mouse = null;
var hits = [];

var draw = function() {
    table.draw(ctx);

    if (mouse) {
        hits.forEach(hit => {
            ctx.beginPath();
            ctx.moveTo(...mouse);
            ctx.lineTo(...hit.centroid);
            ctx.stroke();
        });
    }

    requestAnimationFrame(draw);
};

draw();

var downs = Rx.Observable.fromEvent(document, "mousedown");
var moves = Rx.Observable.fromEvent(document, "mousemove");
var ups = Rx.Observable.fromEvent(document, "mouseup");


downs.subscribe(down => {
    mouse = [down.pageX, down.pageY];

    hits = table.hitTest(...mouse);

    var lastX = down.pageX;
    var lastY = down.pageY;

    moves.takeUntil(ups).subscribe(move => {
        mouse = [move.pageX, move.pageY];

        var lastMouseToMouse = [move.pageX - lastX, move.pageY - lastY];

        hits.forEach(function(hit) {
            var centroid;

            //centroid = hit.centroid;
            //var centroidToLastMouse = [move.pageX - centroid[0], move.pageY - centroid[1]];
            //
            //glMatrix.vec2.normalize(centroidToLastMouse, centroidToLastMouse);
            //var dot = glMatrix.vec2.dot(lastMouseToMouse, centroidToLastMouse);
            //var proj = glMatrix.vec2.scale([], centroidToLastMouse, dot);
            //hit.translate(...proj);

            centroid = hit.centroid;    // get the updated centroid
            var a1 = Math.atan2(lastY - centroid[1], lastX - centroid[0]);
            var a2 = Math.atan2(move.pageY - centroid[1], move.pageX - centroid[0]);

            var [  ,  ,  ,  ,  tx, ty] = hit.transform;
            var m = rotateAroundPoint([tx, ty], a1 - a2);
            glMatrix.mat2d.mul(hit.transform, m, hit.transform);

            var prevDist = glMatrix.vec2.distance(centroid, [lastX, lastY]);
            var currDist = glMatrix.vec2.distance(centroid, [move.pageX, move.pageY]);

            var centroidToMouse = [move.pageX - centroid[0], move.pageY - centroid[1]];
            glMatrix.vec2.normalize(centroidToMouse, centroidToMouse);
            var proj = glMatrix.vec2.scale([], centroidToMouse, currDist - prevDist);
            hit.translate(...proj);
        });

        lastX = move.pageX;
        lastY = move.pageY;
    });

    ups.subscribe(up => {
        mouse = null;
        hits = [];
    });
});
