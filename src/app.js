import {WebGL, Shader, FrameBufferObject, RawTexture} from './engine/graphics.js'
import {Mat4, Vec3, Color4} from './engine/maths.js'
import {WideRenderer, Quad, Circle} from './engine/graphics/shapes.js'
import {Box, Model} from './engine/graphics/meshes.js'
import {Camera} from './engine/graphics/camera.js'
import {PointLight} from './engine/lights.js'

import v_2d from './shaders/main_2d.vert'
import f_2d from './shaders/main_2d.frag'

import v_3d from './shaders/main_3d.vert'
import f_3d from './shaders/main_3d.frag'

import v_debug from './shaders/debug.vert'
import f_debug from './shaders/debug.frag'

import v_bright from './shaders/fx/bright.vert'
import f_bright from './shaders/fx/bright.frag'

import v_bloom from './shaders/fx/bloom.vert'
import f_bloom from './shaders/fx/bloom.frag'

import v_render from './shaders/fx/render.vert'
import f_render from './shaders/fx/render.frag'

import cube from '../assets/models/cube.obj'
import earth from '../assets/models/earth.obj'

let canvas = document.querySelector('#glcanvas');
let wGL;
let gl;
let s2d, s3d, sDebug, sBright, sBloom, sRender;

let quad, circle;
let box, model, lightBox;

let wide;
let fbo;
let colorTex;
let bloomTex;

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

		sBright = new Shader(wGL, v_bright, f_bright);
		sBright.setMatrixUniform("projectionMatrix", camera.getPerspective());

		sBloom = new Shader(wGL, v_bloom, f_bloom);

		sRender = new Shader(wGL, v_render, f_render);

		quad = new Quad(wGL, "cafe.png");
		quad.setScale(100, 100);
		quad.setPosition(-500, 0);

		circle = new Circle(wGL, "block.png");
		circle.setScale(50, 50);
        circle.setPosition(-500, -300);

		box = new Model(wGL, cube);
		box.setTexture("brique.jpg");
		box.setNormalMap("normal_map.jpg");
		box.setDepthMap("displacement_map.jpg")
		box.setScale(0.5, 0.5, 0.5);
		box.setPosition(1.5, 0, 2);
		
		model = new Model(wGL, earth);
		model.setTexture("earth.jpg");
		model.setNormalMap("earth_normal.jpg")
		model.setPosition(0, 0, 2);
		model.setScale(1.5, 1.5, 1.5);

		lightBox = new Model(wGL, cube);
		lightBox.setPosition(-1.0, 0.0, 0.0);
		lightBox.setScale(0.1, 0.1, 0.1);
		lightBox.setBrightColor(new Color4(1.0, 1.0, 0.0, 1.0));

		light = new PointLight(5.0, new Vec3(-1.0, 0.0, 0.0), new Color4(0.9, 0.8, 0.6, 1.0));

		wide = new WideRenderer(wGL);

		fbo = new FrameBufferObject(wGL);
		colorTex = new RawTexture(wGL, canvas.width, canvas.height);
		bloomTex = new RawTexture(wGL, canvas.width, canvas.height);

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

	/* fbo begin */

	fbo.genInTexture(colorTex, () => {
		sBright.bind();
		sBright.setMatrixUniform("viewMatrix", camera.getViewMatrix());

		lightBox.renderWithBright(sBright);
		box.renderWithBright(sBright);
		model.renderWithBright(sBright);		
	});

	//fbo.genInTexture(sceneTex, () => {
		s3d.bind();

		s3d.setVec3Uniform("viewPos", camera.getPosition());
		light.setUniform(s3d, "light");
		s3d.setMatrixUniform("viewMatrix", camera.getViewMatrix());

		box.render(s3d);
		model.render(s3d);
		lightBox.render(s3d);
	//});

	if(debug)
	{
		sDebug.bind();
		sDebug.setMatrixUniform("viewMatrix", camera.getViewMatrix());
		box.debug(sDebug)
		model.debug(sDebug);
	}

	gl.disable(gl.DEPTH_TEST);

	sBloom.bind();
	fbo.genInTexture(bloomTex, () => {
		sBloom.setBooleanUniform("horizontal", true);
		colorTex.bind();
		wide.render(sBloom);
	});

	fbo.genInTexture(colorTex, () => {
		sBloom.setBooleanUniform("horizontal", false);
		bloomTex.bind();
		wide.render(sBloom);
	});

	sRender.bind();
	colorTex.bind();
	wide.render(sRender);

	gl.activeTexture(gl.TEXTURE0);

	s2d.bind();
	quad.render(s2d);
	circle.render(s2d)
}

/* logic */

document.onkeydown = function (e) {
    if(e.key === ",")
		debug = !debug;
	
	if(e.key === "z") {
		camera.pos.addVector(camera.getForward().mul(0.05));
	}
	if(e.key === "q") {
		camera.pos.addVector(camera.getLeft().mul(0.05));
	}
	if(e.key === "s") {
		camera.pos.addVector(camera.getBack().mul(0.05));
	}
	if(e.key === "d") {
		camera.pos.addVector(camera.getRight().mul(0.05));
	}

	if(e.code === "Space") {
		camera.pos.addVector(new Vec3(0, 0.05, 0));
	}

	if(e.code === "ShiftLeft") {
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
	//camera.rot.x -= dy / 50;
	
	if(camera.rot.x > Math.PI / 2) camera.rot.x = Math.PI / 2
	if(camera.rot.x < - Math.PI / 2) camera.rot.x = - Math.PI / 2
}

window.onload = init();
