import {Mat4, Vec3} from './maths.js'
import {Texture} from './graphics.js'

const vertices = [
	-0.5,	-0.5,
	-0.5,	0.5,
	0.5,	0.5,
	0.5,	-0.5
];

const textures = [
	0.0,	0.0,
	0.0,	1.0,
	1.0,	1.0,
	1.0,	0.0
];

const indices = [
	0, 2, 1, 0, 3, 2
];


export class Quad {
	constructor (webGL, texture) {
		let gl = webGL.getContext();
		this.texture = new Texture(webGL, texture);

		this.pos = new Vec3(0, 0, 0);
		this.rot = new Vec3(0, 0, 0);
		this.scale = new Vec3(1, 1, 1);

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.tbo = gl.createBuffer();
		this.ibo = gl.createBuffer();

		gl.bindVertexArray(this.vao);

			gl.enableVertexAttribArray(0);
			gl.enableVertexAttribArray(1);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures), gl.STATIC_DRAW);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

		gl.bindVertexArray(null);
	}

	render(gl, shader)
	{
		let transformationMatrix = new Mat4();

		transformationMatrix.scale(this.scale.x, this.scale.y, this.scale.z);
		transformationMatrix.rotate(this.rot.x, this.rot.y, this.rot.z);
		transformationMatrix.translate(this.pos.x, this.pos.y, this.pos.z);

		this.texture.bind();

		shader.setMatrixUniform("transformationMatrix", transformationMatrix);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
	}

	setScale(width, height)
	{
		this.scale.x = width;
		this.scale.y = height;
		this.scale.z = 1;
	}

	setRotation(a)
	{
		this.rot.x = 0;
		this.rot.y = 0;
		this.rot.z = a;
	}

	setPosition(x, y)
	{
		this.pos.x = x;
		this.pos.y = y;
		this.pos.z = 0;
	}
}