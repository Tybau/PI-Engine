import {WebGL, Shader, FrameBufferObject, RawTexture} from './engine/graphics.js'
import {Mat4, Vec3, Color4} from './engine/maths.js'
import {WideRenderer, Quad, Circle} from './engine/graphics/shapes.js'
import {Model} from './engine/graphics/meshes.js'
import {Camera} from './engine/graphics/camera.js'
import {PointLight, DirectionalLight} from './engine/lights.js'

import {Terrain} from './game/terrain.js'
import {Map} from './game/map.js'
import {MainPlayer, RenderablePlayer} from './game/entities/player.js'

import v_2d from './shaders/main_2d.vert'
import f_2d from './shaders/main_2d.frag'

import v_3d from './shaders/main_3d.vert'
import f_3d from './shaders/main_3d.frag'

import v_3d_c from './shaders/main_3d_colored.vert'
import f_3d_c from './shaders/main_3d_colored.frag'

import v_debug from './shaders/debug.vert'
import f_debug from './shaders/debug.frag'

import cube from '#/assets/models/cube.obj'
import earth from '#/assets/models/earth.obj'
import test from '#/assets/models/test.obj'

let canvas = document.querySelector('#glcanvas');
let wGL;
let gl;
let s2d, s3d, s3dColored, sDebug;

let quad, circle;
let box, model, lightBox, truc;
let map;

let debug = false;

let light, dLight;

let connected = false;
let mainPlayer;
let players = {};
let uid;

function init () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	wGL = new WebGL(canvas);
	gl = wGL.getContext();
	if (gl) {
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.enable(gl.CULL_FACE)

		mainPlayer = new MainPlayer(wGL);

		s2d = new Shader(wGL, v_2d, f_2d);
		s2d.setMatrixUniform("projectionMatrix",  new Mat4().ortho(0, canvas.width, canvas.height, 0, -1, 1));

		s3d = new Shader(wGL, v_3d, f_3d);
		s3d.setMatrixUniform("projectionMatrix",  mainPlayer.camera.getPerspective());

		s3dColored = new Shader(wGL, v_3d_c, f_3d_c);
		s3dColored.setMatrixUniform("projectionMatrix",  mainPlayer.camera.getPerspective());

		sDebug = new Shader(wGL, v_debug, f_debug);
		sDebug.setMatrixUniform("projectionMatrix", mainPlayer.camera.getPerspective());

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

		model = new Model(wGL, test);
		model.setTexture("test.png");
		model.setPosition(0, 0, 2);
		model.setScale(1.5, 1.5, 1.5);

		map = new Map(wGL);

		light = new PointLight(0.5, new Vec3(-0.5, -1.0, -1.0), new Color4(0.5, 0.7, 0.9, 1.0));
		dLight = new DirectionalLight(0.3, new Vec3(0.5, -1.0, 1.0).normalize(), new Color4(1.0, 1.0, 1.0, 1.0));

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

	mainPlayer.move();

	model.setRotation(0.1, t, 0.1);
	box.setRotation(t, t, t);

	light.position = mainPlayer.camera.getPosition();

	if(mainPlayer.socket)
		mainPlayer.socket.emit("sync-me", {
			id : mainPlayer.id,
			pos : mainPlayer.camera.pos,
			rot : mainPlayer.camera.rot
		});
}

function render () {
	gl.clearColor(0.3, 0.5, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

	/* start render scene */

	s3d.bind();

	s3d.setVec3Uniform("viewPos", mainPlayer.camera.getPosition());
	light.setUniform(s3d, "light");
	dLight.setUniform(s3d, "dLight");
	s3d.setMatrixUniform("viewMatrix", mainPlayer.camera.getViewMatrix());

	box.render(s3d);
	model.render(s3d);

	console.log(players);
	for(let p in players)
		if(players[p]) players[p].model.render(s3d);

	s3dColored.bind();

	light.setUniform(s3dColored, "light");
	dLight.setUniform(s3dColored, "dLight");
	s3dColored.setMatrixUniform("viewMatrix", mainPlayer.camera.getViewMatrix());

	map.render(s3dColored);

	/* end render scene */

	if(debug)
	{
		sDebug.bind();
		sDebug.setMatrixUniform("viewMatrix", mainPlayer.camera.getViewMatrix());
		box.debug(sDebug)
		model.debug(sDebug);
	}

	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);

	s2d.bind();
	quad.render(s2d);
	circle.render(s2d)
}

window.onload = init();

mainPlayer.socket.on('new-player', function(p) {
	let player = new RenderablePlayer(wGL, p.id);
	player.model.setPosition(p.pos.x, p.pos.y, p.pos.z);
	player.model.setRotation(0, p.rot.y, 0);
	players[p.id] = player;
});

mainPlayer.socket.on('rm-player', function(id) {
	delete players[id];
});

mainPlayer.socket.on('sync-other', function(p) {
	let pos = p.pos;
	let rot = p.rot;
	let player = players[p.id];
	if(!player)  return;
	player.model.setPosition(pos.x, pos.y, pos.z);
	player.model.setRotation(0, rot.y, 0);
});

mainPlayer.socket.on('sync-others', function(ps) {
	for(let pId in ps) {
		if(pId == mainPlayer.id) continue;
		let p = ps[pId];
		if(!p) continue;
		let player = new RenderablePlayer(wGL, p.id);
		player.model.setPosition(p.pos.x, p.pos.y, p.pos.z);
		player.model.setRotation(0, Math.PI / 2 - p.rot.y, 0);
		players[p.id] = player;
	}
});
