#version 300 es
precision highp float;
precision highp int;

in vec3 v_color;

out vec4 out_color;
in vec2 v_textureCoord;

uniform sampler2D tex;

void main(void) {
	out_color = (texture(tex, v_textureCoord) * 0.3) + vec4(v_color, 1.0) * 0.7;
	//out_color = vec4(v_color, 1.0);
}
