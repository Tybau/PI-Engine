import {WebGL, Shader, Texture} from './engine/graphics.js'
import {Mat4, Vec3, Color4} from './engine/maths.js'
import {Quad} from './engine/render.js'

import vertex from './shaders/main.vert'
import fragment from './shaders/main.frag'

let canvas = document.querySelector('#glcanvas');
let wGL;
let gl;
let shader;

let texture;

let quad;

function init(){
	wGL = new WebGL(canvas);
	gl = wGL.getContext();
	if (gl) {
		shader = new Shader(wGL, vertex, fragment);
		shader.setMatrixUniform("projectionMatrix",  new Mat4().ortho(0, canvas.width, canvas.height, 0, -1, 1));

		quad = new Quad(wGL, "block.png");
		quad.scale.x = 400;
		quad.scale.y = 400;
		quad.scale.z = 400;

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
	
}

function render() {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(shader.getProgram());

	quad.render(gl, shader);
}

window.onload = init();
