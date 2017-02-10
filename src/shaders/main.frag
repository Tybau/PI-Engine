#version 300 es
precision highp float;
precision highp int;

struct Light{
	float intensity;
	vec3 position;
	vec4 color;
};

in vec3 v_position;
in vec2 v_textureCoord;
in vec3 v_normal;

out vec4 out_color;

uniform Light light[2];
uniform sampler2D tex;

void main(void) {
	vec3 light_color = vec3(0.0, 0.0, 0.0);
	for(int i = 0; i < 3; i++){
		vec3 lightDir =  light[i].position - v_position;

		float diffuse = dot(normalize(v_normal), normalize(lightDir));
		float lightDistance = distance(v_position, light[i].position);
		float lightFactor = max(1.0 / lightDistance * diffuse, 0.0);
		light_color += vec3(light[i].color) * lightFactor * light[i].intensity;
	}

	out_color = texture(tex, v_textureCoord) * vec4(light_color, 1.0);
}
