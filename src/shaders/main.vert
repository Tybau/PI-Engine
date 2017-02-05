#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec3 in_position;
layout(location = 1) in vec2 in_textureCoord;

uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;

out vec3 v_color;
out vec2 v_textureCoord;

void main(void) {
	v_color = in_position * 0.5 + 0.5;
	v_textureCoord = in_textureCoord;
	gl_Position = projectionMatrix * transformationMatrix * vec4(in_position, 1.0);
}
