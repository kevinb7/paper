import glMatrix from 'gl-matrix'

class Table {
    constructor() {
        this.children = []; // linked list?
        this.transform = glMatrix.mat2d.identity([]);
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        ctx.transform(...this.transform);
        this.children.forEach(child => child.draw(ctx));
        ctx.restore();
    }

    translate(dx, dy) {
        glMatrix.mat2d.translate(this.transform, this.transform, [dx, dy]);
    }

    add(child) {
        child.parent = this;
        this.children.push(child);
    }

    hitTest(x, y) {
        return this.children.filter(child => {
            var inverse = glMatrix.mat2d.invert([], child.transform);
            var vec = glMatrix.vec2.transformMat2d([], [x, y], inverse);
            return child.contains(...vec);
        });
    }
}

export default Table;
