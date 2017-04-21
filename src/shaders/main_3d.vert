#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec3 in_position;
layout(location = 1) in vec2 in_textureCoord;
layout(location = 2) in vec3 in_normal;
layout(location = 3) in vec3 in_tangent;

uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;

out vec3 v_position;
out vec2 v_textureCoord;
out vec3 v_normal;

out mat3 TBN;

void main(void) {
	vec3 bitangent = cross(in_normal, in_tangent);

	vec3 T = normalize(vec3(transformationMatrix * vec4(in_tangent, 0.0)));
	vec3 B = normalize(vec3(transformationMatrix * vec4(bitangent, 0.0)));
	vec3 N = normalize(vec3(transformationMatrix * vec4(in_normal, 0.0)));
	TBN = transpose(mat3(T, B, N));

	v_position = vec3(transformationMatrix * vec4(in_position, 1.0));
	v_textureCoord = in_textureCoord;
	v_normal = vec3(transformationMatrix * vec4(in_normal, 0.0));
	gl_Position = projectionMatrix * transformationMatrix * vec4(in_position, 1.0);
}