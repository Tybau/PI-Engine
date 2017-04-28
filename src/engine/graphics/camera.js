import {Mat4, Vec3, Color4} from '../maths.js'

export class Camera {
	constructor () {
		this.projectionMatrix = new Mat4();
		this.viewMatrix = new Mat4();

		this.pos = new Vec3(0, 0, 0);
		this.rot = new Vec3(0, 0, 0);
	}

	setPerspective (fov, width, height, zNear, zFar) {
		this.projectionMatrix = new Mat4().perspective(fov, width/height, zNear, zFar);
	}

	getPerspective () {
		return this.projectionMatrix;
	}

	getViewMatrix () {
		return this.viewMatrix;
	}

	update () {
		this.viewMatrix = new Mat4()
			.translate(-this.pos.x, -this.pos.y, -this.pos.z)
			.rotate(this.rot.x, this.rot.y, this.rot.z)
	}
	
	setPosition (x, y, z) {
		this.pos.x = x;
		this.pos.y = y;
		this.pos.z = z;
	}
	
	getPosition () {
		return this.pos;
	}

	setRotation (rx, ry, rz) {
		this.rot.x = rx;
		this.rot.y = ry;
		this.rot.z = rz;
	}

	getRotation () {
		return this.rot;
	}

	getForward () {
		let r = new Vec3(0, 0, 0);
		let rot = this.rot;

		r.x = Math.sin(rot.y);
		r.z = Math.cos(rot.y);

		r.normalize();

		return r;
	}

	getBack () {
		return this.getForward().mul(-1);
	}

	getRight () {
		let r = new Vec3(0, 0, 0);
		let rot = this.rot.copy();

		r.x = Math.cos(rot.y);
		r.z = -Math.sin(rot.y);

		r.normalize();

		return r;
	}

	getLeft () {
		return this.getRight().mul(-1);
	}
}