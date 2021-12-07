export default `#version 300 es
in vec3 a_position;
in vec3 a_uv;

uniform float bias;
uniform float scale;
uniform float waterLevel;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform vec3 viewDirection;
uniform vec3 lightDirection;
uniform sampler2D displacementMap;

out vec2 v_uv;
out float v_height;
out float v_waterLevel;
out vec3 v_normal;
out vec3 v_lightDirection;
out vec3 v_viewDirection;

void main() {
  v_waterLevel = waterLevel;
  v_uv = vec2(a_uv.x - 0.5, a_uv.z - 0.5);

  float displacement = bias + scale * texture(displacementMap, v_uv).x;
  vec3 new_vertex = a_position + displacement * vec3(0.0, 1.0, 0.0);

  v_height = smoothstep(0.0, 1.0, texture(displacementMap, v_uv).x);

  vec2 texel_size = 1.0 / vec2(textureSize(displacementMap, 0));

  float height_up = texture(displacementMap, vec2(v_uv.x, v_uv.y + texel_size.y)).x;
  float height_right = texture(displacementMap, vec2(v_uv.x + texel_size.x, v_uv.y)).x;

  float disp_up = bias + scale * height_up;
  float disp_right = bias + scale * height_right;

  vec3 up = vec3(a_position.x, disp_up, a_position.z + texel_size.y);
  vec3 right = vec3(a_position.x + texel_size.x, disp_right, a_position.z);

  if (v_height <= v_waterLevel) {
    v_normal = vec3(0.0, 1.0, 0.0);
  } else {
    v_normal = normalize(cross(up - new_vertex, right - new_vertex));
  }

  v_normal = vec3(viewMatrix * modelMatrix * vec4(v_normal, 0.0));
  v_lightDirection = vec3(viewMatrix * vec4(lightDirection, 0.0));
  v_viewDirection = -vec3(viewMatrix * modelMatrix * vec4(a_position, 1.0));

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(new_vertex, 1.0);
}`
