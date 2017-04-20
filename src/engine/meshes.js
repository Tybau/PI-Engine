import {Mat4, Vec3} from './maths.js'
import {Texture} from './graphics.js'

export class Mesh {
	constructor (webGL, texture, vertices, textures, normals, indices) {
		let gl = webGL.getContext();
		this.gl = gl;
		this.texture = new Texture(webGL, texture);

		this.vertices = vertices;
		this.textures = textures;
		this.normals = normals;
		this.indices = indices;

		this.pos = new Vec3(0, 0, 0);
		this.rot = new Vec3(0, 0, 0);
		this.scale = new Vec3(1, 1, 1);

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.tbo = gl.createBuffer();
		this.nbo = gl.createBuffer();
		this.ibo = gl.createBuffer();

		this.generateVao();
	}

	render(shader) {
		let gl = this.gl;
		let transformationMatrix = new Mat4();

		shader.bind();

		transformationMatrix.scale(this.scale.x, this.scale.y, this.scale.z);
		transformationMatrix.rotate(this.rot.x, this.rot.y, this.rot.z);
		transformationMatrix.translate(this.pos.x, this.pos.y, this.pos.z);

		this.texture.bind();

		shader.setMatrixUniform("transformationMatrix", transformationMatrix);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
	}

	setScale (width, height, depth) {
		this.scale.x = width;
		this.scale.y = height;
		this.scale.z = depth;
	}

	setRotation (rx, ry, rz) {
		this.rot.x = rx;
		this.rot.y = ry;
		this.rot.z = rz;
	}

	setPosition (x, y, z) {
		this.pos.x = x;
		this.pos.y = y;
		this.pos.z = z;
	}

	generateVao () {
		let gl = this.gl;
		gl.bindVertexArray(this.vao);
			gl.enableVertexAttribArray(0);
			gl.enableVertexAttribArray(1);
			gl.enableVertexAttribArray(2);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textures), gl.STATIC_DRAW);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
			gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
		gl.bindVertexArray(null);
	}
}

export class Box extends Mesh{
	constructor (webGL, texture) {
		let vertices = [
			-0.5,	-0.5,	-0.5,
			-0.5,	0.5,	-0.5,
			0.5,	0.5,	-0.5,
			0.5,	-0.5,	-0.5,

			-0.5,	-0.5,	0.5,
			-0.5,	0.5,	0.5,
			0.5,	0.5,	0.5,
			0.5,	-0.5,	0.5,

			-0.5,	-0.5,	-0.5,
			-0.5,	-0.5,	0.5,
			0.5,	-0.5,	0.5,
			0.5,	-0.5,	-0.5,

			-0.5,	0.5,	-0.5,
			-0.5,	0.5,	0.5,
			0.5,	0.5,	0.5,
			0.5,	0.5,	-0.5,

			-0.5,	-0.5,	-0.5,
			-0.5,	-0.5,	0.5,
			-0.5,	0.5,	0.5,
			-0.5,	0.5,	-0.5,

			0.5,	-0.5,	-0.5,
			0.5,	-0.5,	0.5,
			0.5,	0.5,	0.5,
			0.5,	0.5,	-0.5
		];

		let normals = [
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,

			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,

			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0
		];

		let textures = [
			0.0,	1.0,
			0.0,	0.0,
			1.0,	0.0,
			1.0,	1.0,

			1.0,	1.0,
			1.0,	0.0,
			0.0,	0.0,
			0.0,	1.0,

			1.0,	1.0,
			1.0,	0.0,
			0.0,	0.0,
			0.0,	1.0,

			0.0,	1.0,
			0.0,	0.0,
			1.0,	0.0,
			1.0,	1.0,

			1.0,	1.0,
			0.0,	1.0,
			0.0,	0.0,
			1.0,	0.0,

			0.0,	1.0,
			1.0,	1.0,
			1.0,	0.0,
			0.0,	0.0
		];

		let indices = [
			0, 2, 1, 0, 3, 2,
			4, 5, 6, 4, 6, 7,
			8, 9, 10, 8, 10, 11,
			12, 14, 13, 12, 15, 14,
			16, 18, 17, 16, 19, 18,
			20, 21, 22, 20, 22, 23
		];

		super(webGL, texture, vertices, textures, normals, indices);
	}
}