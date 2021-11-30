export default `#version 300 es
precision mediump float;

in vec3 v_color;
in vec3 v_normal;
in vec3 v_viewDirection;
in vec3 v_lightDirection;

const vec3 ambientCoefficient = vec3(0.1);
const vec3 diffuseCoefficient = vec3(0.5);
const vec3 specularCoefficient = vec3(0.5);
const float shininess = 80.0;

out vec4 out_color;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 viewDirection = normalize(v_viewDirection);
  vec3 lightDirection = normalize(v_lightDirection);
  vec3 reflectedDirection = normalize(reflect(-lightDirection, normal));

  vec3 ambient = ambientCoefficient;
  vec3 diffuse = diffuseCoefficient * clamp(dot(lightDirection, normal), 0.0, 1.0);
  vec3 specular = specularCoefficient * pow(clamp(dot(reflectedDirection, viewDirection), 0.0, 1.0), shininess);
  vec3 color = v_color * (ambient + diffuse + specular);

  vec3 gamma_correction = pow(color, vec3(1.0 / 1.8));

  out_color = vec4(gamma_correction, 1.0);
}`
