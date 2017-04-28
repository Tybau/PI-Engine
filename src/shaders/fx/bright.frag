#version 300 es
precision highp float;
precision highp int;

in vec4 v_color;

out vec4 out_color;

void main () {
	out_color = v_color;
}