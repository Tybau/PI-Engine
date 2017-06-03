import model from '#/assets/models/player.obj'
import {Model} from '&/engine/graphics/meshes.js'
import {Camera} from '&/engine/graphics/camera.js'
import {Vec3} from '&/engine/maths.js'
import io from 'socket.io-client'

export class Player {
	constructor (id) {
		this.id = id;
	}
}

export class RenderablePlayer extends Player{
	constructor (webGL, id) {
		super(id);
		this.model = new Model(webGL, model);
		this.model.setScale(0.4, 0.4, 0.4);
	}
}

export class MainPlayer extends Player{
	constructor (webGL) {
		super(null);
		this.keys = {};

		this.camera = new Camera();
		this.camera.setPerspective(70.0, webGL.canvas.width, webGL.canvas.height, 0.1, 50.0);

		this.socket = io('http://aet-io.com:8080')

		this.camera.setPosition(0, 1, 0);

		this.socket.on('gen-uuid', (id) =>{
			this.id = id;
		});

		saveKeys(this);
		rotateCamera(this);
	}
	move() {
		if(this.keys["z"]) {
			this.camera.pos.addVector(this.camera.getForward().mul(0.05));
		}
		if(this.keys["q"]) {
			this.camera.pos.addVector(this.camera.getLeft().mul(0.05));
		}
		if(this.keys["s"]) {
			this.camera.pos.addVector(this.camera.getBack().mul(0.05));
		}
		if(this.keys["d"]) {
			this.camera.pos.addVector(this.camera.getRight().mul(0.05));
		}

		/*if(this.keys[" "]) {
			this.camera.pos.addVector(new Vec3(0, 0.05, 0));
		}

		if(this.keys["Shift"]) {
			this.camera.pos.addVector(new Vec3(0, -0.05, 0));
		}*/
		this.camera.update();
	}
}

function saveKeys(player) {
	window.addEventListener("keydown", (e) => {
		player.keys[e.key] = true;
		if(e.key == ",")
		  debug = true;
	});
	window.addEventListener("keyup", (e) => {
		player.keys[e.key] = false;
		if(e.key == ",")
		  debug = false;
	});
}

function rotateCamera(player) {
	let mouseX = 0, mouseY = 0;
	let dx, dy;
	let isDown = false;
	document.onmousemove = (e) => {
		dx = mouseX - e.screenX;
		dy = mouseY - e.screenY;

		mouseX = e.screenX;
		mouseY = e.screenY;

		if(isDown) {
			player.camera.rot.y -= dx / 50;
			player.camera.rot.x -= dy / 50;
			if(player.camera.rot.x > Math.PI / 2) player.camera.rot.x = Math.PI / 2;
			if(player.camera.rot.x < - Math.PI / 2) player.camera.rot.x = - Math.PI / 2;
		}
	}

	document.onmousedown = function () {
		isDown = true;
	}

	document.onmouseup = function () {
		isDown = false;
	}
}
