#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec3 in_position;
layout(location = 1) in vec3 in_vector; 
layout(location = 2) in vec4 mat_1;
layout(location = 3) in vec4 mat_2;
layout(location = 4) in vec4 mat_3;
layout(location = 5) in vec4 mat_4;
layout(location = 6) in vec3 in_color;

out vec4 v_color;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

void main(void) {
	v_color = vec4(in_color, 1.0);
	mat4 transformationMatrix = mat4(mat_1, mat_2, mat_3, mat_4);

	gl_Position = projectionMatrix * viewMatrix * transformationMatrix * vec4(0.025 * in_position * in_vector, 1.0);
	//gl_Position = vec4(in_position, 1.0);
}