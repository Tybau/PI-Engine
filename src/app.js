import {WebGL, Shader} from './engine/graphics.js'
import {Mat4, Vec3, Color4} from './engine/maths.js'
import {Quad, Circle} from './engine/graphics/shapes.js'
import {Box, Model} from './engine/graphics/meshes.js'
import {Camera} from './engine/graphics/camera.js'
import {PointLight} from './engine/lights.js'

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
let rot = new Vec3(0, 0, 0);

let camera;

let light;

function init () {
	wGL = new WebGL(canvas);
	gl = wGL.getContext();
	if (gl) {
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		camera = new Camera();
		camera.setPerspective(70.0, canvas.width, canvas.height, 0.1, 100.0);

		s2d = new Shader(wGL, v_2d, f_2d);
		s2d.setMatrixUniform("projectionMatrix",  new Mat4().ortho(0, canvas.width, canvas.height, 0, -1, 1));
		
		s3d = new Shader(wGL, v_3d, f_3d);
		s3d.setMatrixUniform("projectionMatrix",  camera.getPerspective());

		sDebug = new Shader(wGL, v_debug, f_debug);
		sDebug.setMatrixUniform("projectionMatrix", camera.getPerspective());

		quad = new Quad(wGL, "cafe.png");
		quad.setScale(100, 100);
		quad.setPosition(-500, 0);

		circle = new Circle(wGL, "block.png");
		circle.setScale(50, 50);
        circle.setPosition(-500, -300);

		box = new Model(wGL, cube);
		box.setTexture("pierre.jpg");
		box.setNormalMap("pierre_normal_map.png");
		box.setDepthMap("pierre_depth_map.png")
		box.setScale(0.5, 0.5, 0.5);
		box.setPosition(1.5, 0, 2);
		
		model = new Model(wGL, earth);
		model.setTexture("earth.jpg");
		model.setNormalMap("earth_normal.jpg")
		model.setPosition(0, 0, 2);
		model.setScale(1.5, 1.5, 1.5);

		light = new PointLight(5.0, new Vec3(-1.0, 0.0, 0.0), new Color4(0.9, 0.8, 0.6, 1.0));

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

	camera.update();

	model.setRotation(Math.PI + 0.4, t, 0.4);

	box.setRotation(t, t, t);
}

function render () {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);

	s3d.bind();
	s3d.setVec3Uniform("viewPos", camera.getPosition());
	light.setUniform(s3d, "light");
	s3d.setMatrixUniform("viewMatrix", camera.getViewMatrix());

	box.render(s3d);
	model.render(s3d);

	if(debug)
	{
		sDebug.bind();
		sDebug.setMatrixUniform("viewMatrix", camera.getViewMatrix());
		box.debug(sDebug, 1)
		model.debug(sDebug);
	}

	gl.disable(gl.DEPTH_TEST);

	quad.render(s2d);
	circle.render(s2d)
}

/* logic */

document.onkeydown = function (e) {
    if(e.key === ",")
		debug = !debug;
	
	if(e.key === "z") {
		camera.pos.x += 0.05 * Math.sin(rot.y);
		camera.pos.z += 0.05 * Math.cos(rot.y);
	}
	if(e.key === "q") {
		camera.pos.x -= 0.05 * Math.cos(rot.y);
		camera.pos.z += 0.05 * Math.sin(rot.y);
	}
	if(e.key === "s") {
		camera.pos.x -= 0.05 * Math.sin(rot.y);
		camera.pos.z -= 0.05 * Math.cos(rot.y);
	}
	if(e.key === "d") {
		camera.pos.x += 0.05 * Math.cos(rot.y);
		camera.pos.z -= 0.05 * Math.sin(rot.y);
	}
}

let mouseX = 0, mouseY = 0;
let dx, dy;
let isDown = false;
document.onmousemove = function (e) {
	dx = mouseX - e.screenX;
	dy = mouseY - e.screenY;

	mouseX = e.screenX;
	mouseY = e.screenY;

	if(isDown) rotateCamera();
}

document.onmousedown = function () {
	isDown = true;
}

document.onmouseup = function () {
	isDown = false;
}

function rotateCamera() {
	camera.rot.y -= dx / 50;
	camera.rot.x -= dy / 50;
	
	if(camera.rot.x > Math.PI / 2) camera.rot.x = Math.PI / 2
	if(camera.rot.x < - Math.PI / 2) camera.rot.x = - Math.PI / 2
}

window.onload = init();
