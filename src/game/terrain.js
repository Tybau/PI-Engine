import {Mesh} from '../engine/graphics/meshes.js'
import {Vec3} from '../engine/maths.js'

import {Perlin} from './noise.js'

export class Terrain extends Mesh{
	constructor(webGL) {
		let vertices = [];
		let colors = [];
		let normals = [];
		let indices = [];

		for(let i = 0; i < 100; i++) {
			for(let j = 0; j < 100; j++) {
				let index = i * 100 + j

				let v = new Vec3(i, getNoise(i, j), j).subVector(new Vec3(i + 1, getNoise(i + 1, j), j)).normalize();
				let w = new Vec3(i, getNoise(i, j), j).subVector(new Vec3(i, getNoise(i, j + 1), j + 1)).normalize();

				let n = w.cross(v);
				n = n.normalize();

				vertices.push(i, getNoise(i, j), j);
				colors.push(0.2, 0.7, 0.3, 1.0);
				normals.push(n.x, n.y, n.z);
				indices.push(index * 6 + 0);

				vertices.push(i + 1, getNoise(i + 1, j), j);
				colors.push(0.2, 0.7, 0.3, 1.0);
				normals.push(n.x, n.y, n.z);
				indices.push(index * 6 + 1);

				vertices.push(i, getNoise(i, j + 1), j + 1);
				colors.push(0.2, 0.7, 0.3, 1.0);
				normals.push(n.x, n.y, n.z);
				indices.push(index * 6 + 2);

				/* Second */

				v = new Vec3(i + 1, getNoise(i + 1, j + 1), j + 1).subVector(new Vec3(i + 1, getNoise(i + 1, j), j)).normalize();
				w = new Vec3(i + 1, getNoise(i + 1, j + 1), j + 1).subVector(new Vec3(i, getNoise(i, j + 1), j + 1)).normalize();

				n = v.cross(w);
				n = n.normalize();

				vertices.push(i, getNoise(i, j + 1), j + 1);
				colors.push(0.2, 0.7, 0.3, 1.0);
				normals.push(n.x, n.y, n.z);
				indices.push(index * 6 + 3);

				vertices.push(i + 1, getNoise(i + 1, j), j);
				colors.push(0.2, 0.7, 0.3, 1.0);
				normals.push(n.x, n.y, n.z);
				indices.push(index * 6 + 4);

				vertices.push(i + 1, getNoise(i + 1, j + 1), j + 1);
				colors.push(0.2, 0.7, 0.3, 1.0);
				normals.push(n.x, n.y, n.z);
				indices.push(index * 6 + 5);
			}
		}

		super (webGL, vertices, colors, normals, indices);
	}
}

let pn = new Perlin("random seed")

function getNoise(x, y) {
	return pn.noise(x / 10, y / 10, 0) * 2 - 1.5;
}
