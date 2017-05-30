#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec3 in_position;
layout(location = 1) in vec4 in_color;
layout(location = 2) in vec3 in_normal;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 transformationMatrix;

out vec4 v_position;
out vec4 v_relativePosition;
out vec4 v_color;
out vec3 v_normal;

void main(void) {
	v_position =  transformationMatrix * vec4(in_position, 1.0);
	v_relativePosition = viewMatrix * v_position;
	v_color = in_color;
	v_normal = vec3(transformationMatrix * vec4(in_normal, 0.0));
	gl_Position = projectionMatrix * v_relativePosition;
}
