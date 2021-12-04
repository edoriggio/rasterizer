export default `#version 300 es
precision highp float;

in vec2 v_uv;
in float v_height;

uniform sampler2D waterSampler;
uniform sampler2D sandSampler;
uniform sampler2D grassSampler;
uniform sampler2D rockSampler;
uniform sampler2D snowSampler;

const float waterHeight = 0.01;
const float sandHeight = 0.02;
const float grassHeight = 0.04;
const float rockHeight = 0.15;

out vec4 out_color;

void main() {
  if (v_height < waterHeight) {
    out_color = texture(waterSampler, v_uv * vec2(20.0));
  } else if (v_height < sandHeight) {
    out_color = texture(sandSampler, v_uv * vec2(10.0));
  } else if (v_height < grassHeight) {
    out_color = texture(grassSampler, v_uv * vec2(10.0));
  } else if (v_height < rockHeight) {
    out_color = texture(rockSampler, v_uv * vec2(40.0));
  } else {
    out_color = vec4(1.0, 1.0, 1.0, 1.0);
  }

  // out_color = texture(displacementMap, v_uv * vec2(10.0));
  // out_color = vec4(1.0, 1.0, 1.0, 1.0);
}`