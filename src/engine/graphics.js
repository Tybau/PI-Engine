export class WebGL {
	constructor(canvas) {
		this.gl = null;
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

		this.fragmentShader = getShader(gl, 'fs', fragment)
		this.vertexShader = getShader(gl, 'vs', vertex)

		this.program = gl.createProgram()
		gl.attachShader(this.program, this.vertexShader)
		gl.attachShader(this.program, this.fragmentShader)
		gl.linkProgram(this.program)

		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader))
		}

		gl.useProgram(this.program)
	}

	setMatrixUniform(location, mat){
		let gl = this.webGL.getContext()
		var uniform = gl.getUniformLocation(this.program, location)
  		gl.uniformMatrix4fv(uniform, false, new Float32Array(mat.flatten()))
	}

	getProgram() {
		return this.program
	}
}

export class Texture {
	constructor (webGl, path) {
		this.webGl = webGl
		let gl = this.webGl.getContext()
		this.id = gl.createTexture()
		this.image = new Image()
		this.image.onload = () => {
			gl.bindTexture(gl.TEXTURE_2D, this.id)
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
		this.image.src = "./assets/textures/" + path
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

/* internal functions */

let getShader = function(gl, type, shaderFile) {
	let shader;
	if (!shaderFile)
		return null;

	if (type === 'fs'){
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}else if(type === 'vs'){
		shader = gl.createShader(gl.VERTEX_SHADER);
	}else{
		console.error("Unknown shader type !");
		return null;
	}

	gl.shaderSource(shader, shaderFile);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader))
		return null
	}

	return shader;
}
