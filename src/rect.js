import glMatrix from 'gl-matrix';

class Rect {
    constructor(x, y, width, height) {
        var tx = x + width / 2;
        var ty = y + height / 2;
        Object.assign(this, { width, height });

        // adjust it so that internally the centroid is always at [0, 0]
        this.x = x - tx;
        this.y = y - ty;
        this.transform = [];
        glMatrix.mat2d.identity(this.transform);
        glMatrix.mat2d.translate(this.transform, this.transform, [tx, ty]);

        // default color
        this.fill = 'blue';
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.save(); // abstract this into a base class?
        ctx.fillStyle = this.fill;
        ctx.transform(...this.transform);
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // TODO: pull this out into it's own function
        ctx.fillStyle = 'black';
        ctx.beginPath();
        // centroid is always at [0, 0]
        ctx.arc(0, 0, 5, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.restore();
    }

    get centroid() {
        return glMatrix.vec2.transformMat2d([], [this.x + this.width / 2, this.y + this.height / 2], this.transform);
    }

    translate(dx, dy) {
        glMatrix.mat2d.translate(this.transform, this.transform, [dx, dy]);
    }

    contains(x, y) {
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    }
}

export default Rect;
