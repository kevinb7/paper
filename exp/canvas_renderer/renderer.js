import Group from '../scene_graph/group';
import Rect from '../scene_graph/rect';

import './canvas_extensions';

class Renderer {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = canvas.getContext('2d');
    }

    // let the caller worry about clearing the context
    render(node) {
        this.context.save();
        this.context.transform(...node.transform);

        if (node instanceof Group) {
            this.renderGroup(node);
        } else if (node instanceof Rect) {
            this.renderRect(node);
        } else {
            throw "we can't render this type of node yet";
        }

        var centroid = node.centroid;
        if (centroid) {
            this.context.fillStyle = 'black';
            this.context.circle(...centroid, 5);
        }

        this.context.restore();
    }

    renderGroup(group) {
        group.children.forEach(child => this.render(child));
    }

    renderRect(rect) {
        this.context.fillStyle = rect.fill;
        this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
}

export default Renderer;
