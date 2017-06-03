import {Drawable} from './drawable.js'
import {Mat4, Vec3, Vec2, Color4} from '../maths.js'
import {Texture} from '../graphics.js'
import {Primitives} from './debug.js'

export class Mesh extends Drawable{
	constructor (webGL, vertices, colors, normals, indices) {
		super(webGL);

		let gl = webGL.getContext();
		this.gl = gl;

		this.vertices = vertices;
		this.normals = normals;
		this.colors = colors;
		this.indices = indices;

		this.pos = new Vec3(0, 0, 0);
		this.rot = new Vec3(0, 0, 0);
		this.scale = new Vec3(1, 1, 1);

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.cbo = gl.createBuffer();
		this.nbo = gl.createBuffer();
		this.ibo = gl.createBuffer();

		this.generateVao();
		this.resetTransformationMatrix();

		this.modified = false;
	}

	render(shader) {
		let gl = this.gl;

		if(this.modified) this.resetTransformationMatrix();

		shader.setMatrixUniform("transformationMatrix", this.transformationMatrix);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
	}

	setScale (width, height, depth) {
		this.scale.x = width;
		this.scale.y = height;
		this.scale.z = depth;

		this.modified = true;
	}

	setRotation (rx, ry, rz) {
		this.rot.x = rx;
		this.rot.y = ry;
		this.rot.z = rz;

		this.modified = true;
	}

	setPosition (x, y, z) {
		this.pos.x = x;
		this.pos.y = y;
		this.pos.z = z;

		this.modified = true;
	}

	resetTransformationMatrix () {
		let transformationMatrix = new Mat4();

		transformationMatrix.scale(this.scale.x, this.scale.y, this.scale.z);
		transformationMatrix.rotate(this.rot.x, this.rot.y, this.rot.z);
		transformationMatrix.translate(this.pos.x, this.pos.y, this.pos.z);

		this.transformationMatrix = transformationMatrix;
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

			gl.bindBuffer(gl.ARRAY_BUFFER, this.cbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
			gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
			gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
		gl.bindVertexArray(null);
	}
}

export class TexturedMesh extends Drawable{
	constructor (webGL, vertices, uvs, normals, tangents, indices) {
		super(webGL);
		let gl = webGL.getContext();
		this.gl = gl;

		this.vertices = vertices;
		this.uvs = uvs;
		this.normals = normals;
		this.tangents = tangents;
		this.indices = indices;

		this.pos = new Vec3(0, 0, 0);
		this.rot = new Vec3(0, 0, 0);
		this.scale = new Vec3(1, 1, 1);

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.tbo = gl.createBuffer();
		this.nbo = gl.createBuffer();
		this.tnbo = gl.createBuffer();
		this.ibo = gl.createBuffer();

		this.generateVao();
		this.resetTransformationMatrix();

		this.modified = false;

		this.debugLines = new Primitives(this.gl, vertices.length);
	}

	render(shader) {
		let gl = this.gl;

		if(this.modified) this.resetTransformationMatrix();

		gl.activeTexture(gl.TEXTURE0);
		shader.setIntegerUniform("tex", 0);
		this.texture.bind();

		gl.activeTexture(gl.TEXTURE1);
		shader.setIntegerUniform("normalMap", 1);
		this.normalMap.bind();

		gl.activeTexture(gl.TEXTURE2);
		shader.setIntegerUniform("depthMap", 2);
		this.depthMap.bind();

		shader.setMatrixUniform("transformationMatrix", this.transformationMatrix);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);

		gl.activeTexture(gl.TEXTURE0);
	}

	renderWithBright(shader) {
		let gl = this.gl;
		shader.setColor4Uniform("bright_color", this.brightColor);
		shader.setMatrixUniform("transformationMatrix", this.transformationMatrix);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
	}

	debug (shader) {
		let vecs = [];
		let transforms = [];
		let colors = [];

		for(let i = 0; i < this.indices.length; i += 20) {
			let p = new Vec3(this.vertices[i * 3], this.vertices[i * 3 + 1], this.vertices[i * 3 + 2]);
			let n = new Vec3(this.normals[i * 3], this.normals[i * 3 + 1], this.normals[i * 3 + 2]);
			let t = new Vec3(this.tangents[i * 3], this.tangents[i * 3 + 1], this.tangents[i * 3 + 2]);

			let mat = new Mat4()
				.translate(p.x, p.y, p.z)
				.mul(this.transformationMatrix);

			vecs.push(n);
			transforms.push(mat);
			colors.push(new Color4(1, 0, 0, 1));
			vecs.push(t);
			transforms.push(mat);
			colors.push(new Color4(1, 1, 0, 1));
			vecs.push(n.copy().cross(t));
			transforms.push(mat);
			colors.push(new Color4(0, 1, 0, 1));
		}

		this.debugLines.setDatas(vecs, transforms, colors);
		this.debugLines.render();
	}

	setScale (width, height, depth) {
		this.scale.x = width;
		this.scale.y = height;
		this.scale.z = depth;

		this.modified = true;
	}

	setRotation (rx, ry, rz) {
		this.rot.x = rx;
		this.rot.y = ry;
		this.rot.z = rz;

		this.modified = true;
	}

	setPosition (x, y, z) {
		this.pos.x = x;
		this.pos.y = y;
		this.pos.z = z;

		this.modified = true;
	}

	resetTransformationMatrix () {
		let transformationMatrix = new Mat4();

		transformationMatrix.scale(this.scale.x, this.scale.y, this.scale.z);
		transformationMatrix.rotate(this.rot.x, this.rot.y, this.rot.z);
		transformationMatrix.translate(this.pos.x, this.pos.y, this.pos.z);

		this.transformationMatrix = transformationMatrix;
	}

	generateVao () {
		let gl = this.gl;
		gl.bindVertexArray(this.vao);
			gl.enableVertexAttribArray(0);
			gl.enableVertexAttribArray(1);
			gl.enableVertexAttribArray(2);
			gl.enableVertexAttribArray(3);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
			gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.tnbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangents), gl.STATIC_DRAW);
			gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
		gl.bindVertexArray(null);
	}
}

export class Model extends TexturedMesh {
	constructor (webGL, modelCode) {
		let vertices = [];
		let normals = [];
		let tangents = [];
		let uvs = [];
		let indices = [];

		let lines = modelCode.split('\n');

		let loaded_vertices = [];
		let loaded_uvs = [];
		let loaded_normals = [];
		let loaded_indices = [];

		for(let i = 0; i < lines.length; i++) {
			let line = lines[i];
			let args = line.split(' ');

			if(args[0] === "v") {
				loaded_vertices.push(parseFloat(args[1]));
				loaded_vertices.push(parseFloat(args[2]));
				loaded_vertices.push(parseFloat(args[3]));
			}else if(args[0] === "vn") {
				loaded_normals.push(parseFloat(args[1]));
				loaded_normals.push(parseFloat(args[2]));
				loaded_normals.push(parseFloat(args[3]));
			}else if(args[0] === "vt") {
				loaded_uvs.push(parseFloat(args[1]));
				loaded_uvs.push(parseFloat(args[2]));
			}else if(args[0] === "f") {
				let indides_a = args[1].split('/');
				let indides_b = args[2].split('/');
				let indides_c = args[3].split('/');

				let a = new Vec3(parseInt(indides_a[0]) - 1, parseInt(indides_a[1]) - 1, parseInt(indides_a[2]) - 1);
				let b = new Vec3(parseInt(indides_b[0]) - 1, parseInt(indides_b[1]) - 1, parseInt(indides_b[2]) - 1);
				let c = new Vec3(parseInt(indides_c[0]) - 1, parseInt(indides_c[1]) - 1, parseInt(indides_c[2]) - 1);

				loaded_indices.push(a);
				loaded_indices.push(b);
				loaded_indices.push(c);
			}
		}

		for(let i = 0; i < loaded_indices.length; i++) {
			let index = loaded_indices[i];

			vertices.push(-loaded_vertices[index.x * 3 + 0]);
			vertices.push(loaded_vertices[index.x * 3 + 1]);
			vertices.push(loaded_vertices[index.x * 3 + 2]);

			uvs.push(-loaded_uvs[index.y * 2 + 0]);
			uvs.push(loaded_uvs[index.y * 2 + 1]);

			normals.push(-loaded_normals[index.z * 3 + 0]);
			normals.push(loaded_normals[index.z * 3 + 1]);
			normals.push(loaded_normals[index.z * 3 + 2]);

			indices.push(i);
		}

		for(let i = 0; i < normals.length / 3; i += 3) {
			let tangent = getTangent(i, vertices, uvs);

			tangents.push(tangent.x);
			tangents.push(tangent.y);
			tangents.push(tangent.z);

			tangents.push(tangent.x);
			tangents.push(tangent.y);
			tangents.push(tangent.z);

			tangents.push(tangent.x);
			tangents.push(tangent.y);
			tangents.push(tangent.z);
		}
		super(webGL, vertices, uvs, normals, tangents, indices);
	}
}

function getTangent (i, vertices, uvs) {
	let triangle = new Vec3(i, i + 1, i + 2);

	let v0 = new Vec3(vertices[triangle.x * 3], vertices[triangle.x * 3 + 1], vertices[triangle.x * 3 + 2]);
	let v1 = new Vec3(vertices[triangle.y * 3], vertices[triangle.y * 3 + 1], vertices[triangle.y * 3 + 2]);
	let v2 = new Vec3(vertices[triangle.z * 3], vertices[triangle.z * 3 + 1], vertices[triangle.z * 3 + 2]);

	let uv0 = new Vec2(uvs[triangle.x * 2], uvs[triangle.x * 2 + 1]);
	let uv1 = new Vec2(uvs[triangle.y * 2], uvs[triangle.y * 2 + 1]);
	let uv2 = new Vec2(uvs[triangle.z * 2], uvs[triangle.z * 2 + 1]);

	let dPos1 = v1.subVector(v0);
	let dPos2 = v2.subVector(v0);

	let dUV1 = uv1.subVector(uv0);
	let dUV2 = uv2.subVector(uv0);

	let divi = dUV1.x * dUV2.y - dUV2.x * dUV1.y;
	let f = (divi == 0) ? 0.0 : 1.0 / divi;

	return new Vec3(
		f * (dUV2.y * dPos1.x - dUV1.y * dPos2.x),
		f * (dUV2.y * dPos1.y - dUV1.y * dPos2.y),
		f * (dUV2.y * dPos1.z - dUV1.y * dPos2.z)
	).normalize();
}
