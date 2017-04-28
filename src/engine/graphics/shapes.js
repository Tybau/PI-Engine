import {Mat4, Vec3} from '../maths.js'
import {Texture} from '../graphics.js'

export class Shape {
	constructor (webGL, texture, vertices, uvs, indices) {
		let gl = webGL.getContext();
		this.gl = gl;
		this.texture = new Texture(webGL, texture);

		this.vertices = vertices;
		this.uvs = uvs;
		this.indices = indices;

		this.pos = new Vec3(0, 0, 0);
		this.rot = new Vec3(0, 0, 0);
		this.scale = new Vec3(1, 1, 1);

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.tbo = gl.createBuffer();
		this.ibo = gl.createBuffer();

		this.generateVao();
	}

	render(shader) {
		let gl = this.gl;
		let transformationMatrix = new Mat4();

		shader.bind()

		transformationMatrix.scale(this.scale.x, this.scale.y, this.scale.z);
		transformationMatrix.rotate(this.rot.x, this.rot.y, this.rot.z);
		transformationMatrix.translate(this.pos.x, this.pos.y, this.pos.z);

		this.texture.bind();

		shader.setMatrixUniform("transformationMatrix", transformationMatrix);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
	}

	setScale (width, height) {
		this.scale.x = width;
		this.scale.y = height;
		this.scale.z = 1;
	}

	setRotation (a) {
		this.rot.x = 0;
		this.rot.y = 0;
		this.rot.z = a;
	}

	setPosition (x, y) {
		this.pos.x = x;
		this.pos.y = y;
		this.pos.z = 0;
	}

	generateVao () {
		let gl = this.gl;
		gl.bindVertexArray(this.vao);
			gl.enableVertexAttribArray(0);
			gl.enableVertexAttribArray(1);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
		gl.bindVertexArray(null);
	}
}

export class Quad extends Shape{
	constructor (webGL, texture) {
		let vertices = [
			-0.5,	-0.5,
			-0.5,	0.5,
			0.5,	0.5,
			0.5,	-0.5
		];

		let uvs = [
			0.0,	0.0,
			0.0,	1.0,
			1.0,	1.0,
			1.0,	0.0
		];

		let indices = [
			0, 2, 1, 0, 3, 2
		];

		super(webGL, texture, vertices, uvs, indices);
	}
}

export class Circle extends Shape {
	constructor (webGL, texture) {
		let vertices = [0, 0];
		let uvs = [0.5, 0.5];
		let indices = [];

		tesselateCircle (vertices, uvs, indices, 1, 1);

		super(webGL, texture, vertices, uvs, indices);
	}

	setScale (width, height) {
		super.setScale(width, height);

		let vertices = [0, 0];
		let uvs = [0.5, 0.5];
		let indices = [];

		let edge_count = 2 * Math.PI * Math.sqrt((1 / 2) * (width * width + height * height));

		tesselateCircle (vertices, uvs, indices, width, height);

		this.indices = indices;
		this.uvs = uvs;
		this.vertices = vertices;

		this.generateVao();
	}
}

function addCircleVertex (vertices, uvs, i, edge_count) {
	let t = i * (2 * Math.PI / edge_count);
	let x = Math.cos(t);
	let y = Math.sin(t);

	vertices.push(x);
	vertices.push(y);

	uvs.push(x * 0.5 + 0.5);
	uvs.push(y * 0.5 + 0.5);
}

function tesselateCircle (vertices, uvs, indices, width, height) {
	let edge_count = 2 * Math.PI * Math.sqrt((1 / 2) * (width * width + height * height));

	for (let i = 0; i < edge_count; i++) {
		addCircleVertex(vertices, uvs, i, edge_count);

		indices.push(0);
		indices.push(i);
		indices.push(i+1);
	}
	// last triangle
	indices.push(0);
	indices.push(edge_count);
	indices.push(1);
}


/* Render Scene */

export class WideRenderer {
	constructor (webGL) {
		let gl = webGL.getContext();
		this.gl = gl;

		this.vertices = [
			-1.0,	-1.0,
			-1.0,	1.0,
			1.0,	1.0,
			1.0,	-1.0
		];

		this.indices = [
			0, 2, 1, 0, 3, 2
		];

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.ibo = gl.createBuffer();

		this.generateVao();
	}

	render(shader) {
		let gl = this.gl;

		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);

		gl.activeTexture(gl.TEXTURE0);
	}

	generateVao () {
		let gl = this.gl;
		gl.bindVertexArray(this.vao);
			gl.enableVertexAttribArray(0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
		gl.bindVertexArray(null);
	}
}