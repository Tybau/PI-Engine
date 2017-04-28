#version 300 es
precision highp float;
precision highp int;

#define PI 3.14159

in vec2 v_textureCoord;

out vec4 out_color;

uniform sampler2D tex;
uniform bool horizontal;

float Gaussian (float x, float s);

void main(void) {
	ivec2 texSize = textureSize(tex, 0);
	vec2 tex_offset = 1.0 / vec2(texSize.x, texSize.y); 
    vec3 result = vec3(0.0, 0.0, 0.0);
	if(horizontal)
		for(float i = -10.0; i < 10.0; i += 1.0)
		{
			result += texture(tex, v_textureCoord + vec2(tex_offset.x * i, 0.0)).rgb * cos(PI * i / 20.0) / 6.35;
		}
	else
		for(float i = -10.0; i < 10.0; i += 1.0)
		{
			result += texture(tex, v_textureCoord + vec2(0.0, tex_offset.y * i)).rgb * cos(PI * i / 20.0) / 6.35;
		}
	
	out_color = vec4(result, 1.0);
}

float Gaussian (float x, float s)
{
	return (1.0 / sqrt(2.0 * 3.141592 * s)) * exp(-((x * x) / (2.0 * s)));	
}