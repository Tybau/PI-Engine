#version 300 es
precision highp float;
precision highp int;

in vec3 v_position;
in vec2 v_textureCoord;
in vec3 v_normal;

out vec4 out_color;

uniform sampler2D tex;

void main(void) {
	vec3 point = vec3(-5, -5, 10);
	vec3 light =  point - v_position;

	float diffuse = dot(normalize(v_normal), normalize(light));
	//diffuse = clamp(diffuse, 0.1, 1.0);
	/*float lightDistance = distance(v_position, point);
	float lightFactor = max(1.0 / lightDistance * diffuse, 0.0);
	lightFactor = max(lightFactor, 0.01);*/
	vec3 light_color = vec3(0.9, 0.5, 0.0) * diffuse;
	//out_color = (texture(tex, v_textureCoord) * 0.3) + vec4(v_normal, 1.0) * 0.7;
	out_color = texture(tex, v_textureCoord) * vec4(light_color, 1.0);
}
