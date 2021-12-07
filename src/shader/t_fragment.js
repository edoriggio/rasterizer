export default `#version 300 es
precision highp float;

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_viewDirection;
in vec3 v_lightDirection;
in float v_waterLevel;
in float v_height;

uniform sampler2D waterSampler;
uniform sampler2D sandSampler;
uniform sampler2D grassSampler;
uniform sampler2D rockSampler;
uniform sampler2D snowSampler;

const vec3 ambientCoefficient = vec3(0.1);
const vec3 diffuseCoefficient = vec3(0.5);
const vec3 specularCoefficient = vec3(0.1);
const float shininess = 50.0;

out vec4 out_color;

void main() {
  float smoothstep_c;

  float sandHeight = v_waterLevel + 10.0 / 1000.0;
  float grassHeight = sandHeight + 20.0 / 1000.0;
  float rockHeight = grassHeight + 80.0 / 1000.0;
  float snowHeigth = rockHeight + 200.0 / 1000.0;

  if (v_height < v_waterLevel) {
    smoothstep_c = smoothstep(0.0, sandHeight, v_height);
    out_color = (1.0 - smoothstep_c) * texture(waterSampler, v_uv * vec2(25.0)) + smoothstep_c * texture(sandSampler, v_uv * vec2(25.0));
  } else if (v_height < sandHeight) {
    smoothstep_c = smoothstep(sandHeight, grassHeight, v_height);
    out_color = (1.0 - smoothstep_c) * texture(sandSampler, v_uv * vec2(25.0)) + smoothstep_c * texture(grassSampler, v_uv * vec2(25.0));
  } else if (v_height < grassHeight) {
    smoothstep_c = smoothstep(grassHeight, rockHeight, v_height);
    out_color = (1.0 - smoothstep_c) * texture(grassSampler, v_uv * vec2(25.0)) + smoothstep_c * texture(rockSampler, v_uv * vec2(25.0));
  } else if (v_height < rockHeight) {
    smoothstep_c = smoothstep(rockHeight, snowHeigth, v_height);
    out_color = (1.0 - smoothstep_c) * texture(rockSampler, v_uv * vec2(25.0)) + smoothstep_c * texture(snowSampler, v_uv * vec2(25.0));
  } else {
    out_color = texture(snowSampler, v_uv * vec2(25.0));
  }

  vec3 normal = normalize(v_normal);
  vec3 viewDirection = normalize(v_viewDirection);
  vec3 lightDirection = normalize(v_lightDirection);
  vec3 reflectedDirection = normalize(reflect(-lightDirection, normal));

  vec3 ambient = ambientCoefficient * vec3(out_color);
  vec3 diffuse = diffuseCoefficient * clamp(dot(lightDirection, normal), 0.0, 1.0) * vec3(out_color);
  vec3 specular = specularCoefficient * pow(clamp(dot(reflectedDirection, viewDirection), 0.0, 1.0), shininess);
  vec3 color = ambient + diffuse + specular;

  vec3 gamma_correction = pow(color, vec3(1.0 / 1.8));

  out_color = vec4(gamma_correction, 1.0);
}`
