import {Mat4, Vec3, Vec2, Color4} from './maths.js'
import {Texture} from './graphics.js'

export class Mesh {
	constructor (webGL, texture, normalMap, vertices, uvs, normals, tangents, indices) {
		let gl = webGL.getContext();
		this.gl = gl;
		this.texture = new Texture(webGL, texture);
		this.normalMap = new Texture(webGL, normalMap);

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

		this.debugLine = new Line(this.gl);
	}

	render(shader) {
		let gl = this.gl;

		if(this.modified) this.resetTransformationMatrix();

		shader.bind();

		if(this)

		gl.activeTexture(gl.TEXTURE0);
		shader.setIntegerUniform("tex", 0);
		this.texture.bind();

		gl.activeTexture(gl.TEXTURE1);
		shader.setIntegerUniform("normalMap", 1);
		this.normalMap.bind();

		shader.setMatrixUniform("transformationMatrix", this.transformationMatrix);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);

		gl.activeTexture(gl.TEXTURE0);
	}

	renderDebug (shader, ignore) {
		let line = this.debugLine;
		shader.bind();

		for(let i = 0; i < this.vertices.length; i += 3 * ignore) {

			let p = new Vec3(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]);
			let n = new Vec3(this.normals[i], this.normals[i + 1], this.normals[i + 2]);
			let t = new Vec3(this.tangents[i], this.tangents[i + 1], this.tangents[i + 2]);

			let mat = new Mat4()
				.translate(p.x, p.y, p.z)
				.mul(this.transformationMatrix);

			shader.setMatrixUniform('transformationMatrix', mat);
			shader.setVec3Uniform("vector", n);
			shader.setColor4Uniform("color", new Color4(1.0, 0.0, 0.0, 1.0));

			line.render(shader);

			shader.setMatrixUniform('transformationMatrix', mat);
			shader.setVec3Uniform("vector", t);
			shader.setColor4Uniform("color", new Color4(1.0, 1.0, 0.0, 1.0));
			
			line.render(shader);

			shader.setMatrixUniform('transformationMatrix', mat);
			shader.setVec3Uniform("vector", t.copy().cross(n));
			shader.setColor4Uniform("color", new Color4(0.0, 1.0, 0.0, 1.0));
			
			line.render(shader);
		}
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

/*
	Tangents fucked up
*/
export class Box extends Mesh{
	constructor (webGL, texture, normalMap) {
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

		let uvs = [
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

		let tangents = [
			1.0,	0.0,	0.0,
			1.0,	0.0,	0.0,
			1.0,	0.0,	0.0,
			1.0,	0.0,	0.0,

			-1.0,	0.0,	0.0,
			-1.0,	0.0,	0.0,
			-1.0,	0.0,	0.0,
			-1.0,	0.0,	0.0,

			0.0,	0.0,	1.0,
			0.0,	0.0,	1.0,
			0.0,	0.0,	1.0,
			0.0,	0.0,	1.0,

			0.0,	0.0,	-1.0,
			0.0,	0.0,	-1.0,
			0.0,	0.0,	-1.0,
			0.0,	0.0,	-1.0,

			0.0,	1.0,	0.0,
			0.0,	1.0,	0.0,
			0.0,	1.0,	0.0,
			0.0,	1.0,	0.0,

			0.0,	-1.0,	0.0,
			0.0,	-1.0,	0.0,
			0.0,	-1.0,	0.0,
			0.0,	-1.0,	0.0,			
		];

		super(webGL, texture, normalMap, vertices, uvs, normals, tangents, indices);
	}
}

export class Line {
	constructor (gl) {
		this.gl = gl;
		this.vertices = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0];
		this.indices = [0, 1];

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.ibo = gl.createBuffer();

		gl.bindVertexArray(this.vao);
			gl.enableVertexAttribArray(0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
		gl.bindVertexArray(null);
	}

	render (shader) {
		let gl = this.gl;

		shader.bind();
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.LINES, this.indices.length, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
	}
}

export class Model extends Mesh {
	constructor (webGL, modelCode, texture, normalMap) {
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

			vertices.push(loaded_vertices[index.x * 3 + 0]);
			vertices.push(loaded_vertices[index.x * 3 + 1]);
			vertices.push(loaded_vertices[index.x * 3 + 2]);

			uvs.push(loaded_uvs[index.y * 2 + 0]);
			uvs.push(loaded_uvs[index.y * 2 + 1]);

			normals.push(loaded_normals[index.z * 3 + 0]);
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
		super(webGL, texture, normalMap, vertices, uvs, normals, tangents, indices);
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