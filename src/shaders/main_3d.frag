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
in vec2 v_textureCoord;
in vec3 v_normal;

in mat3 TBN;

out vec4 out_color;

uniform PointLight light;
uniform DirectionalLight dLight;

uniform sampler2D tex;
uniform sampler2D normalMap;
uniform sampler2D depthMap;

uniform vec3 viewPos;

vec2 calcParallaxMap(sampler2D dispMap, mat3 tbnMatrix, vec3 directionToEye, vec2 texCoords, float scale, float bias) {
    return texCoords.xy - (directionToEye * tbnMatrix).xy * (texture(dispMap, texCoords.xy).r * scale + bias);
}

void main(void) {
	/* Point Light */
	vec3 viewDir = normalize(viewPos - v_position.xyz);
	vec2 parallaxTexCoord = calcParallaxMap(depthMap, TBN, viewDir, v_textureCoord,  0.1, 0.0);

	vec3 lightDir = light.position - v_position.xyz;

	vec3 normal = texture(normalMap, parallaxTexCoord).rgb;
    normal = normalize(normal * 2.0 - 1.0);
	normal = normalize(TBN * normal);

	float diffuse = dot(normalize(normal), normalize(lightDir));
	float lightDistance = distance(v_position.xyz, light.position);
	float lightFactor = max(diffuse / lightDistance, 0.01);

	vec3 light_color = vec3(light.color) * max(lightFactor * light.intensity, 0.1);

	/* Directional Light */
	diffuse = dot(normalize(normal), normalize(-dLight.direction));
	light_color += vec3(dLight.color) * max(diffuse * dLight.intensity, 0.1);

	/* Fog */
	float fog = (15.0 - length(v_relativePosition)) / 15.0;
	fog = clamp(fog, 0.0, 1.0);

	out_color = texture(tex, parallaxTexCoord) * vec4(light_color, 1.0);
	out_color = mix(vec4(0.3, 0.5, 0.9, 1.0), out_color, vec4(fog));
}
