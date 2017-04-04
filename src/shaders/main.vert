#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec2 in_position;
layout(location = 1) in vec2 in_textureCoord;

uniform mat4 transformationMatrix;
uniform mat4 projectionMatrix;

out vec2 v_textureCoord;

void main(void) {
	v_textureCoord = in_textureCoord;
	gl_Position = projectionMatrix * transformationMatrix * vec4(in_position, 0.0, 1.0);
}
