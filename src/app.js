import {WebGL, Shader, Texture} from './engine/graphics.js'
import {Mat4} from './engine/maths.js'

import vertex from './shaders/main.vert'
import fragment from './shaders/main.frag'

let canvas = document.querySelector('#glcanvas');
let wGL;
let gl;
let shader;
let vao, vbo, tbo, nbo, ibo;

let texture;

let projectionMatrix;
let transformationMatrix;

let up = 0;

const vertices = [
	-1.0,	-1.0,	-1.0,
	-1.0,	1.0,	-1.0,
	1.0,	1.0,	-1.0,
	1.0,	-1.0,	-1.0,

	-1.0,	-1.0,	1.0,
	-1.0,	1.0,	1.0,
	1.0,	1.0,	1.0,
	1.0,	-1.0,	1.0,

	-1.0,	-1.0,	-1.0,
	-1.0,	-1.0,	1.0,
	1.0,	-1.0,	1.0,
	1.0,	-1.0,	-1.0,

	-1.0,	1.0,	-1.0,
	-1.0,	1.0,	1.0,
	1.0,	1.0,	1.0,
	1.0,	1.0,	-1.0,

	-1.0,	-1.0,	-1.0,
	-1.0,	-1.0,	1.0,
	-1.0,	1.0,	1.0,
	-1.0,	1.0,	-1.0,

	1.0,	-1.0,	-1.0,
	1.0,	-1.0,	1.0,
	1.0,	1.0,	1.0,
	1.0,	1.0,	-1.0,
];

const normals = [
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
	1, 0, 0,
]

const textures = [
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
	0.0,	0.0,
];

const indices = [
	0, 2, 1, 0, 3, 2,
	4, 5, 6, 4, 6, 7,
	8, 9, 10, 8, 10, 11,
	12, 14, 13, 12, 15, 14,
	16, 18, 17, 16, 19, 18,
	20, 21, 22, 20, 22, 23
];

function init(){
	wGL = new WebGL(canvas);
	gl = wGL.getContext();
	if (gl) {
		shader = new Shader(wGL, vertex, fragment);

		vao = gl.createVertexArray();
		vbo = gl.createBuffer();
		tbo = gl.createBuffer();
		nbo = gl.createBuffer(),
		ibo = gl.createBuffer();

		gl.enable(gl.DEPTH_TEST)
		gl.enable(gl.CULL_FACE)

		gl.bindVertexArray(vao);

		gl.enableVertexAttribArray(0);
		gl.enableVertexAttribArray(1);
		gl.enableVertexAttribArray(2);

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures), gl.STATIC_DRAW);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

		gl.bindVertexArray(null);

		projectionMatrix = new Mat4().perspective(70.0, canvas.width/canvas.height, 0.1, 100.0);
		//projectionMatrix = new Mat4().ortho(0, canvas.width, canvas.height, 0, -1, 1);
		transformationMatrix = new Mat4();
		transformationMatrix.scale(1, 1, 1);
		transformationMatrix.rotate(0, 0, 0);
		transformationMatrix.translate(0, 0, 0);

		texture = new Texture(wGL, "block.png")

		loop()
	}
}

function loop()
{
    window.requestAnimationFrame(loop, canvas);
	update();
    render();
}

function update () {
	up += 0.01;
	transformationMatrix = new Mat4();
	transformationMatrix.scale(1, 1, 1);
	transformationMatrix.rotate(up, up, 0);
	transformationMatrix.translate(0, 0, 5);
}

function render() {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(shader.getProgram());

	shader.setMatrixUniform("projectionMatrix", projectionMatrix);
	shader.setMatrixUniform("transformationMatrix", transformationMatrix);

	texture.bind()

	gl.bindVertexArray(vao);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
}

window.onload = init();
