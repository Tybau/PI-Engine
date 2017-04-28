#version 300 es
precision highp float;
precision highp int;

layout (location = 0) in vec3 in_position;

out vec4 v_color;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 transformationMatrix;

uniform vec4 bright_color;

void main () {
	v_color = bright_color;
	gl_Position = projectionMatrix * viewMatrix * transformationMatrix * vec4(in_position, 1.0);
}