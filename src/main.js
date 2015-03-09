import glMatrix from 'gl-matrix';
import paper from './paper.js';

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
rect1.fill = 'orange';
rect2.fill = 'green';
var table = new paper.Table();

table.add(rect1);
table.add(rect2);

Number.prototype.toRadians = function() {
    return Math.PI * this / 180;
};

var angle = 20;
[rect1, rect2].forEach(rect => rect.rotate( angle.toRadians() ) );

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

    var lastMouse = mouse;

    moves.takeUntil(ups).subscribe(move => {
        mouse = [move.pageX, move.pageY];

        hits.forEach(function(hit) {
            var centroid = hit.centroid;

            // maintain the distance
            // do the rotation first
            // then figure out where the centroid should be
            // then do the translation

            var a1 = Math.atan2(lastMouse[1] - centroid[1], lastMouse[0] - centroid[0]);
            var a2 = Math.atan2(mouse[1] - centroid[1], mouse[0] - centroid[0]);

            var percent = 1.0;
            hit.rotate(percent * (a1 - a2));

            var prevDist = glMatrix.vec2.distance(centroid, lastMouse);
            var currDist = glMatrix.vec2.distance(centroid, mouse);

            var centroidToMouse = [mouse[0] - centroid[0], mouse[1] - centroid[1]];
            glMatrix.vec2.normalize(centroidToMouse, centroidToMouse);
            var proj = glMatrix.vec2.scale([], centroidToMouse, percent * (currDist - prevDist));
            hit.translate(...proj);

            var delta = glMatrix.vec2.sub([], mouse, lastMouse);
            glMatrix.vec2.scale(delta, delta, 1 - percent);
            hit.translate(...delta);
        });

        lastMouse = mouse;
    });

    ups.subscribe(up => {
        mouse = null;
        hits = [];
    });
});
