import {Mat4} from './maths.js'

export class WebGL {
	constructor(canvas) {
		this.gl = null;
		this.canvas = canvas;
		try {
			this.gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2")
		}
		catch(e) {}

		if (!this.gl)
			console.error("Unable to initialize WebGL 2. Your browser may not support it. You maybe can enable it (https://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation)")
	}

	getContext() {
		return this.gl
	}
}

export class Shader {
	constructor(webGL, vertex, fragment) {
		this.webGL = webGL;
		let gl = webGL.getContext()

		this.fragmentShader = getShader(gl, gl.FRAGMENT_SHADER, fragment)
		this.vertexShader = getShader(gl, gl.VERTEX_SHADER, vertex)

		this.program = gl.createProgram()
		gl.attachShader(this.program, this.vertexShader)
		gl.attachShader(this.program, this.fragmentShader)
		gl.linkProgram(this.program)

		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader))
		}

		gl.useProgram(this.program)
	}

	setMatrixUniform(location, mat) {
		let gl = this.webGL.getContext()
		var uniform = gl.getUniformLocation(this.program, location)
  		gl.uniformMatrix4fv(uniform, false, new Float32Array(mat.flatten()))
	}

	setVec3Uniform(location, vec) {
		let gl = this.webGL.getContext()
		var uniform = gl.getUniformLocation(this.program, location)
  		gl.uniform3f(uniform, vec.x, vec.y, vec.z)
	}

	setColor4Uniform(location, c) {
		let gl = this.webGL.getContext()
		var uniform = gl.getUniformLocation(this.program, location)
  		gl.uniform4f(uniform, c.r, c.g, c.b, c.a)
	}

	setIntegerUniform(location, i){
		let gl = this.webGL.getContext()
		var uniform = gl.getUniformLocation(this.program, location)
  		gl.uniform1i(uniform, i)
	}

	setBooleanUniform(location, b){
		let gl = this.webGL.getContext()
		var uniform = gl.getUniformLocation(this.program, location)
		if(b)
  			gl.uniform1i(uniform, 1)
		else
			gl.uniform1i(uniform, 0)
	}

	bind() {
		let gl = this.webGL.getContext()
		gl.useProgram(this.program)
	}

	getProgram() {
		return this.program
	}
}

export class RawTexture {
	constructor (webGl, width, height){
		this.webGl = webGl;
		this.gl = webGl.getContext();
		let gl = this.gl ;
		this.width = width;
		this.height = height;
		this.id = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.id);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	}
	bind () {
		let gl = this.webGl.getContext()
		gl.bindTexture(gl.TEXTURE_2D, this.id)
	}
	unbind () {
		let gl = this.webGl.getContext()
		gl.bindTexture(gl.TEXTURE_2D, null)
	}
	getId () {
		return this.id
	}
}

export class Texture {
	constructor (webGl, path) {
		this.webGl = webGl
		let gl = this.webGl.getContext()
		this.id = gl.createTexture()
		this.image = new Image()
		this.image.src = "./assets/textures/" + path
		//this.image.onload = () => {
			gl.bindTexture(gl.TEXTURE_2D, this.id)
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
		//}

	}
	bind () {
		let gl = this.webGl.getContext()
		gl.bindTexture(gl.TEXTURE_2D, this.id)
	}
	unbind () {
		let gl = this.webGl.getContext()
		gl.bindTexture(gl.TEXTURE_2D, null)
	}
	getId () {
		return this.id
	}
}

export class FrameBufferObject {
	constructor (webGL) {
		this.gl = webGL.getContext();
		let gl = this.gl;

		this.fbo = gl.createFramebuffer();
		this.rbo = gl.createRenderbuffer();
	}

	genInTexture (texture, callback) {
		let gl = this.gl;

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.getId(), 0);
		gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texture.width, texture.height);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rbo);

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		callback();

		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer( gl.FRAMEBUFFER, null);
	}
}

/* internal functions */

function getShader(gl, shaderType, shaderCode) {
	let shader;
	if (!shaderCode || !shaderType)
		return null;

	shader = gl.createShader(shaderType);

	gl.shaderSource(shader, shaderCode);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader))
		return null
	}

	return shader;
}
