import {WebGL, Shader} from './engine/graphics.js'
import {Mat4} from './engine/maths.js'
import {Quad, Circle} from './engine/shapes.js'

import vertex from './shaders/main.vert'
import fragment from './shaders/main.frag'

let canvas = document.querySelector('#glcanvas');
let wGL;
let gl;
let shader;

let quad, circle;

function init () {
	wGL = new WebGL(canvas);
	gl = wGL.getContext();
	if (gl) {
		shader = new Shader(wGL, vertex, fragment);
		shader.setMatrixUniform("projectionMatrix",  new Mat4().ortho(0, canvas.width, canvas.height, 0, -1, 1));
		
		quad = new Quad(wGL, "cafe.png");
		quad.setScale(100, 100);

		circle = new Circle(wGL, "block.png");
		circle.setScale(150, 150);
        circle.setPosition(200, 200);

		loop();
	}
}

function loop () {
	window.requestAnimationFrame(loop, canvas);
	update();
	render();
}

let t = 0;

function update () {
	t += 0.01;

	circle.setPosition(Math.cos(t) * 200, Math.sin(t) * 200)
}

function render () {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	quad.render(shader);
	circle.render(shader);
}

window.onload = init();
