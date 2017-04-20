import {WebGL, Shader} from './engine/graphics.js'
import {Mat4} from './engine/maths.js'
import {Quad, Circle} from './engine/shapes.js'
import {Box, Quad3D} from './engine/meshes.js'

import v_2d from './shaders/main_2d.vert'
import f_2d from './shaders/main_2d.frag'

import v_3d from './shaders/main_3d.vert'
import f_3d from './shaders/main_3d.frag'

let canvas = document.querySelector('#glcanvas');
let wGL;
let gl;
let s2d, s3d;

let quad, circle;
let box;

function init () {
	wGL = new WebGL(canvas);
	gl = wGL.getContext();
	if (gl) {
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		s2d = new Shader(wGL, v_2d, f_2d);
		s2d.setMatrixUniform("projectionMatrix",  new Mat4().ortho(0, canvas.width, canvas.height, 0, -1, 1));
		
		s3d = new Shader(wGL, v_3d, f_3d);
		s3d.setMatrixUniform("projectionMatrix",  new Mat4().perspective(70.0, canvas.width/canvas.height, 0.1, 100.0));

		quad = new Quad(wGL, "cafe.png");
		quad.setScale(100, 100);

		circle = new Circle(wGL, "block.png");
		circle.setScale(50, 50);
        circle.setPosition(200, 200);

		box = new Box(wGL, "block.png");
		box.setPosition(1, 0, 3);
		box.setRotation(0, 0, 0);
		box.setScale(1, 1, 1);

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

	circle.setPosition(Math.cos(t) * 200, Math.sin(t) * 200);
	circle.setScale(100 + 50 * Math.sin(t), 100 + 50 * Math.sin(t));
	circle.setRotation(t);

	box.setRotation(t, t, t);
}

function render () {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);

	box.render(s3d);

	gl.disable(gl.DEPTH_TEST);

	quad.render(s2d);
	circle.render(s2d);
}

window.onload = init();
