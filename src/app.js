import {WebGL, Shader} from './engine/graphics.js'
import {Mat4, Vec3} from './engine/maths.js'
import {Quad, Circle} from './engine/shapes.js'
import {Box, Model} from './engine/meshes.js'

import v_2d from './shaders/main_2d.vert'
import f_2d from './shaders/main_2d.frag'

import v_3d from './shaders/main_3d.vert'
import f_3d from './shaders/main_3d.frag'

import v_debug from './shaders/debug.vert'
import f_debug from './shaders/debug.frag'

import cube from '../assets/models/cube.obj'
import earth from '../assets/models/earth.obj'

let canvas = document.querySelector('#glcanvas');
let wGL;
let gl;
let s2d, s3d, sDebug;

let quad, circle;
let box, model;

let debug = false;
let pos = new Vec3(0, 0, 0);

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

		sDebug = new Shader(wGL, v_debug, f_debug);
		sDebug.setMatrixUniform("projectionMatrix",  new Mat4().perspective(70.0, canvas.width/canvas.height, 0.1, 100.0));

		quad = new Quad(wGL, "cafe.png");
		quad.setScale(100, 100);
		quad.setPosition(-500, 0);

		circle = new Circle(wGL, "block.png");
		circle.setScale(50, 50);
        circle.setPosition(-500, -300);

		box = new Model(wGL, cube, "brique.png", "normal2.png");
		box.setScale(0.5, 0.5, 0.5);
		box.setPosition(1.5, 0, 2);
		

		model = new Model(wGL, earth, "earth.jpg", "earth_normal.jpg");
		model.setPosition(0, 0, 2);
		model.setScale(1.5, 1.5, 1.5);


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
	t += 0.002;

	model.setRotation(Math.PI + 0.4, t, 0.4);

	box.setRotation(t, t, t);
}

function render () {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);

	s3d.bind();
	s3d.setMatrixUniform("viewMatrix", new Mat4().translate(-pos.x, -pos.y, -pos.z));

	box.render(s3d);
	model.render(s3d);

	if(debug)
	{
		sDebug.bind();
		sDebug.setMatrixUniform("viewMatrix", new Mat4().translate(-pos.x, -pos.y, -pos.z));
		//box.renderDebug(sDebug, 1)
		model.renderDebug(sDebug, 30);
	}

	gl.disable(gl.DEPTH_TEST);

	quad.render(s2d);
	circle.render(s2d)
}

document.onkeydown = function (e) {
    if(e.key === ",")
		debug = !debug;
	
	if(e.key === "z")
		pos.z += 0.05;
	if(e.key === "q")
		pos.x -= 0.05;
	if(e.key === "s")
		pos.z -= 0.05;
	if(e.key === "d")
		pos.x += 0.05;
}

window.onload = init();
