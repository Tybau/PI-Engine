import {Mesh} from '../engine/graphics/meshes.js'
import {Vec3, Color4} from '../engine/maths.js'

export class Floor extends Mesh{
	constructor(webGL, color) {
		let vertices = [
			0, 0, 0,
			1, 0, 0,
			1, 0, 1,
			0, 0, 1
		];
		let colors = [
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a
		];
		let normals = [
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0
		];
		let indices = [0, 1, 2, 0, 2, 3];

		super (webGL, vertices, colors, normals, indices);
		this.color = color;
	}
}

export class Wall extends Mesh{
	constructor(webGL, color) {
		let vertices = [
			0, 0, 0,
			1, 0, 0,
			1, 1, 0,
			0, 1, 0
		];
		let colors = [
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a
		];
		let normals = [
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1
		];
		let indices = [0, 1, 2, 0, 2, 3];

		super (webGL, vertices, colors, normals, indices);
		this.color = color;
	}
}

export class Map {
	constructor (webGL) {
		let wall_color = new Color4(0.5, 0.5, 0.5, 1.0);
		this.floor = new Floor(webGL, new Color4(0.7, 0.7, 0.7, 1.0));
		this.floor.setScale(8, 1, 10);
		this.floor.setPosition(-4, -2, -5);

		this.nWall = new Wall(webGL, wall_color);
		this.nWall.setScale(8, 2, 1);
		this.nWall.setPosition(-4, -2, 5);

		this.wWall = new Wall(webGL, wall_color);
		this.wWall.setRotation(0, Math.PI / 2, 0)
		this.wWall.setScale(10, 2, 1);
		this.wWall.setPosition(-4, -2, -5);

		this.eWall = new Wall(webGL, wall_color);
		this.eWall.setRotation(0, -Math.PI / 2, 0)
		this.eWall.setScale(10, 2 , 1);
		this.eWall.setPosition(4, -2, 5);

		this.sWall = new Wall(webGL, wall_color);
		this.sWall.setRotation(0, -Math.PI, 0)
		this.sWall.setScale(8, 2, 1);
		this.sWall.setPosition(4, -2, -5);
	}

	render (shader) {
		this.floor.render(shader);
		this.nWall.render(shader);
		this.wWall.render(shader);
		this.eWall.render(shader);
		this.sWall.render(shader);
	}
}
