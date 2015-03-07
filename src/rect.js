import glMatrix from 'gl-matrix';

class Rect {
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });
        this.transform = glMatrix.mat2d.identity([]);
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
        ctx.restore();
    }

    translate(dx, dy) {
        glMatrix.mat2d.translate(this.transform, this.transform, [dx, dy]);
    }
}

export default Rect;
