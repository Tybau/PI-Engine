#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec3 in_position;
layout(location = 1) in vec2 in_textureCoord;
layout(location = 2) in vec3 in_normal;

uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;

out vec3 v_position;
out vec2 v_textureCoord;
out vec3 v_normal;

void main(void) {
	v_position = vec3(transformationMatrix * vec4(in_position, 1.0));
	v_textureCoord = in_textureCoord;
	v_normal = vec3(transformationMatrix * vec4(in_normal, 0.0));
	gl_Position = projectionMatrix * transformationMatrix * vec4(in_position, 1.0);
}