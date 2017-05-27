import {Shader} from './graphics.js'

export class PointLight{
	constructor (intensity, position, color){
		this.position = position;
		this.intensity = intensity;
		this.color = color;
	}
	setUniform (shader, location) {
		let gl = shader.webGL.getContext();
  		gl.uniform1f(gl.getUniformLocation(shader.program, location + ".intensity"), this.intensity);
		gl.uniform3f(gl.getUniformLocation(shader.program, location + ".position"), this.position.x, this.position.y, this.position.z);
		gl.uniform4f(gl.getUniformLocation(shader.program, location + ".color"), this.color.r, this.color.g, this.color.b, this.color.a);
	}
}

export class DirectionalLight{
	constructor (intensity, direction, color){
		this.direction = direction;
		this.intensity = intensity;
		this.color = color;
	}
	setUniform (shader, location) {
		let gl = shader.webGL.getContext();
  		gl.uniform1f(gl.getUniformLocation(shader.program, location + ".intensity"), this.intensity);
		gl.uniform3f(gl.getUniformLocation(shader.program, location + ".direction"), this.direction.x, this.direction.y, this.direction.z);
		gl.uniform4f(gl.getUniformLocation(shader.program, location + ".color"), this.color.r, this.color.g, this.color.b, this.color.a);
	}
}
