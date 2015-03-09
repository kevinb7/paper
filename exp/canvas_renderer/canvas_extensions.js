CanvasRenderingContext2D.prototype.circle = function(x,y,r) {
    this.beginPath();
    this.arc(x,y,r,0,2*Math.PI,false);
    this.fill();
};

CanvasRenderingContext2D.prototype.line = function(x1,y1,x2,y2) {
    this.beginPath();
    this.moveTo(x1,y1);
    this.lineTo(x2,y2);
    this.stroke();
};