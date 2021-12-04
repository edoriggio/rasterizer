var terrain_vertices = [];
var terrain_normals = [];

// The function for creating a subdivided quad for terrain rendering.
// It creates vertices for a quad [-0.5..0.5]^2 in the XZ plane.
// You can play around with parameter step which defines the size of individual triangles.
// The total number of triangles is approx. (2.0/step)^2.
// Setting the value of step to sth smaller than 0.001 is not very practical.
function create_terrain() {
  let step = 0.01;

  for(let x = -0.5; x < 0.5; x = x + step) {
    for(let z = -0.5; z < 0.5; z = z + step) {
      let v1 = vec3.fromValues(x, 0.0 ,z);
      let v2 = vec3.fromValues(x, 0.0, z + step);
      let v3 = vec3.fromValues(x + step, 0.0, z + step);
      let v4 = vec3.fromValues(x + step, 0.0, z);

      terrain_vertices.push(v1[0], v1[1], v1[2]);
      terrain_vertices.push(v2[0], v2[1], v2[2]);
      terrain_vertices.push(v3[0], v3[1], v3[2]);
      terrain_vertices.push(v1[0], v1[1], v1[2]);
      terrain_vertices.push(v3[0], v3[1], v3[2]);
      terrain_vertices.push(v4[0], v4[1], v4[2]);
    }
  }
}

create_terrain();
