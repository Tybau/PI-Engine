#version 300 es
precision highp float;
precision highp int;

struct PointLight{
	float intensity;
	vec3 position;
	vec4 color;
};

struct DirectionalLight{
	float intensity;
	vec3 direction;
	vec4 color;
};

in vec4 v_position;
in vec4 v_relativePosition;
in vec4 v_color;
in vec3 v_normal;

out vec4 out_color;

uniform PointLight light;
uniform DirectionalLight dLight;

void main(void) {
	/* Points Light */
	vec3 lightDir = light.position - v_position.xyz;

	float diffuse = dot(normalize(v_normal), normalize(lightDir));
	float lightDistance = distance(v_position.xyz, light.position);
	float lightFactor = max(diffuse / lightDistance, 0.01);

	vec3 light_color = vec3(light.color) * max(lightFactor * light.intensity, 0.1);

	/* Directional Light */
	diffuse = dot(normalize(v_normal), normalize(-dLight.direction));
	light_color += vec3(dLight.color) * max(diffuse * dLight.intensity, 0.1);

	/* Fog */
	float fog = (15.0 - length(v_relativePosition)) / 15.0;
	fog = clamp(fog, 0.0, 1.0);

	out_color = vec4(vec3(v_color) * light_color, 1.0);
	out_color = mix(vec4(0.3, 0.5, 0.9, 1.0), out_color, vec4(fog));
}
