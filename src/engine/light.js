import {Shader} from './graphics.js'

export class Light{
	constructor(intensity, position, color){
		this.position = position;
		this.intensity = intensity;
		this.color = color;
	}
}
