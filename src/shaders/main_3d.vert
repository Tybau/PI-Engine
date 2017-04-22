#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec3 in_position;
layout(location = 1) in vec2 in_textureCoord;
layout(location = 2) in vec3 in_normal;
layout(location = 3) in vec3 in_tangent;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 transformationMatrix;

out vec4 v_position;
out vec2 v_textureCoord;
out vec3 v_normal;

out mat3 TBN;

void main(void) {
	vec3 T = vec3(viewMatrix * transformationMatrix * vec4(in_tangent, 0.0));
	vec3 N = vec3(viewMatrix * transformationMatrix * vec4(in_normal, 0.0));
	//T = T - dot(T, N) * N; // wtf
	vec3 B = cross(T, N);
	TBN = mat3(T, B, N);

	v_position =  transformationMatrix * vec4(in_position, 1.0);
	v_textureCoord = in_textureCoord;
	v_normal = N;
	gl_Position = projectionMatrix * viewMatrix * v_position;
}