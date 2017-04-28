#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec2 in_position;
layout(location = 1) in vec2 in_textureCoords;

out vec2 v_textureCoord;

void main(void) {
	v_textureCoord = in_position / 2.0 + 0.5;
	gl_Position = vec4(in_position, 0.0, 1.0);
}
