import Group from './scene_graph/group';
import Rect from './scene_graph/rect';
import Renderer from './canvas_renderer/renderer';

console.log("hello, world");

var canvas = document.getElementById('canvas');
var renderer = new Renderer(canvas);

var group = new Group();
var rect1 = new Rect(100,100,100,100);
var rect2 = new Rect(300,200,100,100);
rect2.fill = 'green';

group.add(rect1);
group.add(rect2);

renderer.render(group);