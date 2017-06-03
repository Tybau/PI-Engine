import {Mesh, Model} from '../engine/graphics/meshes.js'
import {Vec3, Color4} from '../engine/maths.js'
import {Terrain} from './terrain.js'

import windowModel from '#/assets/models/window.obj'

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

export class WindowedWall extends Mesh{
	constructor(webGL, color) {
		let vertices = [
			0, 0, 0,
			1, 0, 0,
			1, 0.2, 0,
			0, 0.2, 0,

			0, 0.8, 0,
			1, 0.8, 0,
			1, 1, 0,
			0, 1, 0,

			0, 0.2, 0,
			0.2, 0.2, 0,
			0.2, 0.8, 0,
			0, 0.8, 0,

			0.8, 0.2, 0,
			1.0, 0.2, 0,
			1.0, 0.8, 0,
			0.8, 0.8, 0
		];
		let colors = [
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,

			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,

			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,

			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a,
			color.r, color.g, color.b, color.a
		];
		let normals = [
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1
		];
		let indices = [0, 1, 2, 0, 2, 3,
			4, 5, 6, 4, 6, 7,
			8, 9, 10, 8, 10, 11,
			12, 13, 14, 12, 14, 15];

		super (webGL, vertices, colors, normals, indices);
		this.color = color;

		this.window = new Model(webGL, windowModel);
	}
	render (shader, modelShader) {
		super.render(shader);

		this.window.setPosition(this.pos.x, this.pos.y, this.pos.z);
		this.window.setRotation(this.rot.x, this.rot.y, this.rot.z);
		modelShader.bind();
		this.window.render(modelShader);
		shader.bind();
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

		this.width = 8;
		this.height = 10;

		this.floor = new Floor(webGL, new Color4(0.7, 0.7, 0.7, 1.0));
		this.floor.setScale(8, 1, 10);
		this.floor.setPosition(-4, 0, -5);

		this.walls = [];

		for(let i = 0; i < this.width; i += 2) {
			let wall = i == 2 ? new WindowedWall(webGL, wall_color) : new Wall(webGL, wall_color);
			wall.setPosition(i - 4, 0, 5);
			wall.setScale(2, 2, 1);
			this.walls.push(wall);
		}

		for(let i = 0; i < this.width; i += 2) {
			let wall = i == 2 ? new WindowedWall(webGL, wall_color) : new Wall(webGL, wall_color);
			wall.setPosition(4 - i, 0, -5);
			wall.setScale(2, 2, 1);
			wall.setRotation(0, -Math.PI, 0);
			this.walls.push(wall);
		}

		for(let i = 0; i < this.height; i += 2) {
			let wall = i == 2 ? new WindowedWall(webGL, wall_color) : new Wall(webGL, wall_color);
			wall.setPosition(-4, 0, i - 5);
			wall.setScale(2, 2, 1);
			wall.setRotation(0, Math.PI / 2, 0);
			this.walls.push(wall);
		}

		for(let i = 0; i < this.height; i += 2) {
			let wall = (i / 2 % 2) == 1 ? new WindowedWall(webGL, wall_color) : new Wall(webGL, wall_color);
			wall.setPosition(4, 0, i - 5 + 2);
			wall.setScale(2, 2, 1);
			wall.setRotation(0, -Math.PI / 2, 0);
			this.walls.push(wall);
		}

		this.terrain = new Terrain(webGL);
		this.terrain.setPosition(-50, 0, -50);
	}

	render (shader, modelShader) {
		this.floor.render(shader);
		this.walls.forEach(w => w.render(shader, modelShader));

		this.terrain.render(shader);
	}
}
