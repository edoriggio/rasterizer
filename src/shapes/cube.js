const cube_vertices = [
  // Front face
  -0.5, 0.5, 0.5,
  -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5,
  -0.5, 0.5, 0.5,
  0.5, -0.5, 0.5,
  0.5, 0.5, 0.5,
  
  // Back face
  0.5, -0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5,
  0.5, 0.5, -0.5,
  0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5,

  // Top face
  -0.5, 0.5, 0.5,
  0.5, 0.5, -0.5,
  -0.5, 0.5, -0.5,
  -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  0.5, 0.5, -0.5,

  // Bottom face
  -0.5, -0.5, 0.5,
  -0.5, -0.5, -0.5,
  0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5,
  0.5, -0.5, -0.5,
  0.5, -0.5, 0.5,

  // Right face
  0.5, -0.5, 0.5,
  0.5, -0.5, -0.5,
  0.5, 0.5, -0.5,
  0.5, 0.5, 0.5,
  0.5, -0.5, 0.5,
  0.5, 0.5, -0.5,

  // Left face
  -0.5,  0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5,
  -0.5, 0.5, -0.5,
  -0.5, -0.5, 0.5,
  -0.5, 0.5, 0.5,
];

const cube_colors = [
  // Front face
  0.5, 0.8, 0.8,
  0.5, 0.8, 0.8,
  0.5, 0.8, 0.8,
  0.5, 0.8, 0.8,
  0.5, 0.8, 0.8,
  0.5, 0.8, 0.8,
  
  // Back face
  0.8, 0.0, 0.0,
  0.8, 0.0, 0.0,
  0.8, 0.0, 0.0,
  0.8, 0.0, 0.0,
  0.8, 0.0, 0.0,
  0.8, 0.0, 0.0,

  // Top face
  0.0, 0.8, 0.0,
  0.0, 0.8, 0.0,
  0.0, 0.8, 0.0,
  0.0, 0.8, 0.0,
  0.0, 0.8, 0.0,
  0.0, 0.8, 0.0,

  // Bottom fac
  0.0, 0.0, 0.8,
  0.0, 0.0, 0.8,
  0.0, 0.0, 0.8,
  0.0, 0.0, 0.8,
  0.0, 0.0, 0.8,
  0.0, 0.0, 0.8,

  // Right face
  0.8, 0.8, 0.0,
  0.8, 0.8, 0.0,
  0.8, 0.8, 0.0,
  0.8, 0.8, 0.0,
  0.8, 0.8, 0.0,
  0.8, 0.8, 0.0,

  // Left face
  0.8, 0.0, 0.8,
  0.8, 0.0, 0.8,
  0.8, 0.0, 0.8,
  0.8, 0.0, 0.8,
  0.8, 0.0, 0.8,
  0.8, 0.0, 0.8,
];

var cube_normals = [];

function compute_normals(vertices, normals) {
  for(var i = 0; i < vertices.length; i += 9) {
    var v1 = vec3.fromValues(vertices[i], vertices[i+1], vertices[i+2]);
    var v2 = vec3.fromValues(vertices[i+3], vertices[i+4], vertices[i+5]);
    var v3 = vec3.fromValues(vertices[i+6], vertices[i+7], vertices[i+8]);

    var v1v2 = vec3.create();
    var v1v3 = vec3.create();

    vec3.subtract(v1v2, v2, v1);
    vec3.subtract(v1v3, v3, v1);

    var n = vec3.create();
    vec3.cross(n, v1v2, v1v3);
    vec3.normalize(n, n);

    for (var j = 0; j < 3; j++) {
      normals.push(n[0], n[1], n[2]);
    }
  }
}

compute_normals(cube_vertices,cube_normals);
