import {WebGL, Shader} from './engine/graphics.js'
import {Mat4} from './engine/maths.js'
import {Quad} from './engine/render.js'

import vertex from './shaders/main.vert'
import fragment from './shaders/main.frag'

let canvas = document.querySelector('#glcanvas');
let wGL;
let gl;
let shader;

let quad, cafe;

function init(){
	wGL = new WebGL(canvas);
	gl = wGL.getContext();
	if (gl) {
		shader = new Shader(wGL, vertex, fragment);
		shader.setMatrixUniform("projectionMatrix",  new Mat4().ortho(0, canvas.width, canvas.height, 0, -1, 1));
		
		quad = new Quad(wGL, "block.png");
		quad.setScale(400, 400);

		cafe = new Quad(wGL, "cafe.png");
		cafe.setScale(200, 200);

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

	quad.render(gl, shader);
	cafe.render(gl, shader);
}

window.onload = init();
