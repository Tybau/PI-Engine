import {Model} from '&/engine/graphics/meshes.js'
import {Vec3, Mat4} from '&/engine/maths.js'
import human from '#/assets/models/player.obj'
import zombie from '#/assets/models/zombie.obj'
import ak from '#/assets/models/ak.obj'

export class Entity {
	constructor (webGL, id) {
		this.webGL = webGL;
		this.id = id;

		this.pos = new Vec3(0, 0, 0);
		this.rot = new Vec3(0, 0, 0);
		this.scale = new Vec3(0, 0, 0);
	}
}

export class RenderablePlayer extends Entity {
	constructor (webGL, id) {
		super(id);
		this.model = new Model(webGL, human);
		this.model.setScale(0.4, 0.4, 0.4);

		this.weapon = new Model(webGL, ak);
		this.weapon.scale = new Vec3(0.4, 0.4, 0.4);
	}
	update() {
		this.model.setPosition(this.pos.x, this.pos.y, this.pos.z);
		this.model.setRotation(0, -this.rot.y, 0);

		this.weapon.rot = new Vec3(-this.rot.x, 0, -this.rot.z);
		this.weapon.pos = new Vec3(0.3, 2.0, 1.0);
	}

	render(shader) {
		this.model.render(shader);
		this.weapon.renderAdChildren(shader, this.model.transformationMatrix);
	}
}

export class Zombie extends Entity {
	constructor (webGL, id) {
		super(id);
		this.model = new Model(webGL, zombie);
		this.model.setScale(0.1, 0.1, 0.1);
	}
	update() {
		this.model.setPosition(this.pos.x, this.pos.y, this.pos.z);
		this.model.setRotation(this.rot.x, this.rot.y, this.rot.z);
	}
	render(shader) {
		this.model.render(shader);
	}
}

export let entityTypes = {
	'player' : RenderablePlayer,
	'zombie' : Zombie
}
