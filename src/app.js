import {WebGL, Shader, FrameBufferObject, RawTexture} from './engine/graphics.js'
import {Mat4, Vec3, Color4} from './engine/maths.js'
import {WideRenderer, Quad, Circle} from './engine/graphics/shapes.js'
import {Model} from './engine/graphics/meshes.js'
import {Camera} from './engine/graphics/camera.js'
import {PointLight, DirectionalLight} from './engine/lights.js'

import {Terrain} from './game/terrain.js'
import {Map} from './game/map.js'

import v_2d from './shaders/main_2d.vert'
import f_2d from './shaders/main_2d.frag'

import v_3d from './shaders/main_3d.vert'
import f_3d from './shaders/main_3d.frag'

import v_3d_c from './shaders/main_3d_colored.vert'
import f_3d_c from './shaders/main_3d_colored.frag'

import v_debug from './shaders/debug.vert'
import f_debug from './shaders/debug.frag'

import cube from '../assets/models/cube.obj'
import earth from '../assets/models/earth.obj'
import test from '../assets/models/test.obj'
import machin from '../assets/models/machin.obj'

let canvas = document.querySelector('#glcanvas');
let wGL;
let gl;
let s2d, s3d, s3dColored, sDebug;

let quad, circle;
let box, model, lightBox, truc;
let map;

let debug = false;
let pos = new Vec3(0, 0, 0);
let rot = new Vec3(0, 0, 0);

let camera;

let light, dLight;

function init () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	wGL = new WebGL(canvas);
	gl = wGL.getContext();
	if (gl) {
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.enable(gl.CULL_FACE)

		camera = new Camera();
		camera.setPerspective(70.0, canvas.width, canvas.height, 0.1, 100.0);

		s2d = new Shader(wGL, v_2d, f_2d);
		s2d.setMatrixUniform("projectionMatrix",  new Mat4().ortho(0, canvas.width, canvas.height, 0, -1, 1));

		s3d = new Shader(wGL, v_3d, f_3d);
		s3d.setMatrixUniform("projectionMatrix",  camera.getPerspective());

		s3dColored = new Shader(wGL, v_3d_c, f_3d_c);
		s3dColored.setMatrixUniform("projectionMatrix",  camera.getPerspective());

		sDebug = new Shader(wGL, v_debug, f_debug);
		sDebug.setMatrixUniform("projectionMatrix", camera.getPerspective());

		quad = new Quad(wGL, "cafe.png");
		quad.setScale(100, 100);
		quad.setPosition(-700, 0);

		circle = new Circle(wGL, "block.png");
		circle.setScale(50, 50);
        circle.setPosition(-700, -400);

		box = new Model(wGL, cube);
		box.setTexture("brique.jpg");
		box.setNormalMap("normal_map.jpg");
		box.setDepthMap("displacement_map.jpg")
		box.setScale(0.5, 0.5, 0.5);
		box.setPosition(1.5, 0, 2);

		truc = new Model(wGL, machin);
		truc.setScale(0.3, 0.3, 0.3);

		model = new Model(wGL, test);
		model.setTexture("test.png");
		model.setPosition(0, 0, 2);
		model.setScale(1.5, 1.5, 1.5);

		map = new Map(wGL);

		light = new PointLight(0.5, new Vec3(-0.5, -1.0, -1.0), new Color4(0.5, 0.7, 0.9, 1.0));
		dLight = new DirectionalLight(0.3, new Vec3(1.0, -1.0, 1.0), new Color4(1.0, 1.0, 1.0, 1.0));

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

	whatKeys();

	camera.update();

	model.setRotation(0.1, t, 0.1);

	box.setRotation(t, t, t);

	light.position = camera.getPosition();
}

function render () {
	gl.clearColor(0.3, 0.5, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

	/* start render scene */

	s3d.bind();

	s3d.setVec3Uniform("viewPos", camera.getPosition());
	light.setUniform(s3d, "light");
	dLight.setUniform(s3d, "dLight");
	s3d.setMatrixUniform("viewMatrix", camera.getViewMatrix());

	box.render(s3d);
	model.render(s3d);
	truc.render(s3d);

	s3dColored.bind();

	light.setUniform(s3dColored, "light");
	dLight.setUniform(s3dColored, "dLight");
	s3dColored.setMatrixUniform("viewMatrix", camera.getViewMatrix());

	map.render(s3dColored);

	/* end render scene */

	if(debug)
	{
		sDebug.bind();
		sDebug.setMatrixUniform("viewMatrix", camera.getViewMatrix());
		box.debug(sDebug)
		model.debug(sDebug);
		truc.debug(sDebug);
	}

	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);

	s2d.bind();
	quad.render(s2d);
	circle.render(s2d)
}

/* logic */
let keys = {};
window.addEventListener("keydown", function (e) {
  keys[e.key] = true;
  if(e.key == ",")
	  debug = true;
});
window.addEventListener("keyup", function (e) {
  keys[e.key] = false;
  if(e.key == ",")
	  debug = false;
});

function whatKeys () {
	if(keys["z"]) {
		camera.pos.addVector(camera.getForward().mul(0.05));
	}
	if(keys["q"]) {
		camera.pos.addVector(camera.getLeft().mul(0.05));
	}
	if(keys["s"]) {
		camera.pos.addVector(camera.getBack().mul(0.05));
	}
	if(keys["d"]) {
		camera.pos.addVector(camera.getRight().mul(0.05));
	}

	if(keys[" "]) {
		camera.pos.addVector(new Vec3(0, 0.05, 0));
	}

	if(keys["Shift"]) {
		camera.pos.addVector(new Vec3(0, -0.05, 0));
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
