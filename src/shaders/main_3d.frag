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

in mat3 TBN;

out vec4 out_color;

//uniform Light light;
uniform sampler2D tex;
uniform sampler2D normalMap;

void main(void) {
	Light light;
	light.intensity = 2.0;
	light.position = vec3(-1.0, 0.0, 0.0);
	light.color = vec4(0.9, 0.8, 0.6, 1.0);

	vec3 lightDir = light.position - v_position;

	vec3 normal = texture(normalMap, v_textureCoord).rgb;
    normal = normalize(normal * 2.0 - 1.0);   
	normal = normalize(TBN * normal); 

	float diffuse = dot(normalize(normal), normalize(lightDir));
	float lightDistance = distance(v_position, light.position);
	float lightFactor = max(1.0 / lightDistance * diffuse, 0.0);

	vec3 light_color = vec3(light.color) * max(lightFactor * light.intensity, 0.05);
	out_color = texture(tex, v_textureCoord) * vec4(light_color, 1.0);

	//out_color = vec4(1.0, 1.0, 1.0, 1.0)* vec4(light_color, 1.0);
}