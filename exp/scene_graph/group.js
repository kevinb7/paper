import glMatrix from 'gl-matrix';

class Group {
    constructor() {
        this.children = [];
        this.transform = glMatrix.mat2d.identity([]);
    }

    add(child) {
        child.parent = this;
        this.children.push(child);
    }
}

export default Group;
