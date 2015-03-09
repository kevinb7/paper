import glMatrix from 'gl-matrix';

class Rect {
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });
        this.transform = glMatrix.mat2d.identity([]);
        this.fill = 'blue';
    }

    get centroid() {
        return [this.x + this.width / 2, this.y + this.height / 2];
    }

    contains(x, y) {

    }

    translate(dx, dy) {
        glMatrix.mat2d.translate(this.transform, this.transform, [dx, dy]);
    }

    rotate(angle) {

    }
}

export default Rect;
