import {Texture} from '../graphics.js'
import {Color4} from '../maths.js'

export class Drawable {
	constructor (webGL) {
		this.webGL = webGL;
		this.texture = new Texture(webGL, "defaults/texture.png");
		this.normalMap = new Texture(webGL, "defaults/normal_map.png");
		this.depthMap = new Texture(webGL, "defaults/depth_map.png");
		this.brightColor = new Color4(0, 0, 0, 1);
	}

	setTexture (texture) {
		this.texture = new Texture(this.webGL, texture);
	}

	setNormalMap (texture) {
		this.normalMap = new Texture(this.webGL, texture);
	}

	setDepthMap (texture) {
		this.depthMap = new Texture(this.webGL, texture);
	}

	setBrightColor (color) {
		this.brightColor = color;
	}
}