#version 300 es
precision highp float;
precision highp int;

in vec2 v_textureCoord;

out vec4 out_color;

uniform sampler2D tex;

void main(void) {
	out_color = texture(tex, v_textureCoord);
	out_color = vec4(out_color.rgb, (out_color.r + out_color.g + out_color.b) / 3.0);
	//out_color = vec4(out_color.rgb, 1.0);
}
