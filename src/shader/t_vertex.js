export default `#version 300 es
in vec3 a_position;
in vec3 a_normal;
in vec3 a_uv;

uniform float bias;
uniform float scale;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
// uniform vec3 viewDirection;
// uniform vec3 lightDirection;
uniform sampler2D displacementMap;

out vec2 v_uv;
out float v_height;
// out vec3 v_normal;
// out vec3 v_lightDirection;
// out vec3 v_viewDirection;

void main() {
  v_uv = vec2(a_uv.x - 0.5, a_uv.z - 0.5);

  float displacement = bias + scale * length(vec3(texture(displacementMap, v_uv)));
  vec3 new_vertex = a_position + displacement * vec3(0.0, 1.0, 0.0);

  v_height = smoothstep(0.0, 1.0, texture(displacementMap, v_uv).x);
  
  // v_normal = vec3(viewMatrix * modelMatrix * vec4(a_normal, 0.0));
  // v_lightDirection = vec3(viewMatrix * vec4(lightDirection, 0.0));
  // v_viewDirection = vec3(projectionMatrix * vec4(0.0, 0.0, -1.0, 0.0));

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(new_vertex, 1.0);
}`
