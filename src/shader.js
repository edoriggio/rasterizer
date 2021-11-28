var vertexShaderCode =
  `#version 300 es
  in vec3 a_position;
  in vec3 a_color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  // Exercise 3: add input attribute for normals
  //             add output variables required for light computation, e.g., normal, view direction etc.
  //             add here also a uniform for light direction, unless you pass it directly to the fragment shader

  out vec3 v_color;

  void main() {
    v_color = a_color;

    // compute all the variables required for light computation in the fragment shader
    // remember that all the locations and vectors have to be in a common space, e.g., eye/camera space

    // replace the rotationMatrix with correct transformations

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position, 1.0);
  }`;

var fragmentShaderCode =
  `#version 300 es
  precision mediump float;

  in vec3 v_color;

  // Exercise 3: add all the input variable passed from the vertex shader
  //             if the do not include the light direction, you should add here an additional uniform for it
  //             you can also add here constants for Phong shading model, e.g., light color, ambient, diffuse, and specular coefficients, gamma value, as well as shininess


  out vec4 out_color;

  void main() {
    // Exercise 3: add computation of Phong shading
    //             do not forget about: normalizing all vectors beforehand, (2) performing gamma correction at the end

    out_color = vec4(v_color, 1.0);
  }`;


var gl; // WebGL context
var shaderProgram; // The GLSL program we will use for rendering
var triangle_vao; // The vertex array object for the triangle
var cube_vao; // The cube array object for the cube

// Exercise 2: you may want to add here variable for VAO of plane and sphere

/**
 * Function to initialize the WebGL context.
 */
function initWebGL() {
  var canvas = document.getElementById("webgl-canvas");
  gl = canvas.getContext("webgl2");

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  if (gl) {
    console.log("WebGL successfully initialized.");
  } else {
    console.log("Failed to initialize WebGL.")
  }
}


/**
 * Function to compile the shader.
 * @param shader The shader to compile
 * @param source The source of the shader
 * @param type The type of the shader
 * @param name The name of the shader (default: "")
 */
function compileShader(shader, source, type, name = "") {
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    console.log(name + " shader compiled successfully.");
  } else {
    console.log(name + " vertex shader error.")
    console.log(gl.getShaderInfoLog(shader));
  }
}


/**
 * Function to link the GLSL program by combining the vertex and
 * fragment shaders.
 * @param program The GLSL program
 * @param vertShader The vertex shader
 * @param fragShader The fragment shader
 */
function linkProgram(program, vertShader, fragShader) {
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("The shaders are initialized.");
  } else {
    console.log("Could not initialize shaders.");
  }
}


/**
 * Function to create the GLSL programs.
 */
function createGLSLPrograms() {
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  compileShader(vertexShader, vertexShaderCode, gl.VERTEX_SHADER, "Vertex shader");

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  compileShader(fragmentShader, fragmentShaderCode, gl.VERTEX_SHADER, "Fragment shader");

  shaderProgram = gl.createProgram();
  linkProgram(shaderProgram, vertexShader, fragmentShader);

  shaderProgram.rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix");
}

// Exercise 2:
// Since one has to repeat creating VAO of each object (cube, plane, sphere) separately,
// we suggest implement a function which takes the arrays containing values of the attributes,
// and then, creates VBOa, VAOs, and sets up the attributes.
// This should later simplify your code in initBuffers() to something like:
//      cube_vao = gl.createVertexArray();
//      createVAO(cube_vao, shaderProgram, cube_vertices, cube_normals, cube_colors);
//      sphere_vao = gl.createVertexArray();
//      createVAO(sphere_vao, shaderProgram, sphere_vertices, sphere_vertices, sphere_colors);
//      plane_vao = gl.createVertexArray();
//      createVAO(plane_vao, shaderProgram, plane_vertices, plane_normals, plane_colors);
function createVAO(vao, shader, vertices, colors) {
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
  gl.bindVertexArray(vao);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  var positionAttributeLocation = gl.getAttribLocation(shader, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  var colorAttributeLocation = gl.getAttribLocation(shader, "a_color");
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
}


/**
 * Function to initialize the buffers.
 */
function initBuffers() {
  cube_vao = gl.createVertexArray();
  createVAO(cube_vao, shaderProgram, cube_vertices, cube_colors);

  sphere_vao = gl.createVertexArray();
  createVAO(sphere_vao, shaderProgram, sphere_vertices, sphere_colors);

  plane_vao = gl.createVertexArray();
  createVAO(plane_vao, shaderProgram, plane_vertices, plane_colors);
}

/**
 * Function to draw the scene.
 */
function draw() {
  let camera_azimuthal_angle = document.getElementById("camera_azimuthal_angle").value / 360 * 2 * Math.PI;
  let camera_polar_angle = document.getElementById("camera_polar_angle").value / 360 * 2 * Math.PI;
  let camera_distance = document.getElementById("camera_distance").value / 10;
  let camera_fov = document.getElementById("camera_fov").value / 360 * 2 * Math.PI;
  let light_azimuthal_angle = document.getElementById("light_azimuthal_angle").value / 360 * 2 * Math.PI;
  let light_polar_angle = document.getElementById("light_polar_angle").value / 360 * 2 * Math.PI;

  // Camera position
  let camera_x = camera_distance * Math.cos(camera_azimuthal_angle) * Math.sin(camera_polar_angle);
  let camera_y = camera_distance * Math.sin(camera_azimuthal_angle) * Math.sin(camera_polar_angle);
  let camera_z = camera_distance * Math.cos(camera_polar_angle);
  let camera_position = vec3.fromValues(camera_x, camera_y, camera_z);

  // Light direction
  let light_x = Math.sin(light_polar_angle) * Math.cos(light_azimuthal_angle);
  let light_y = Math.sin(light_polar_angle) * Math.sin(light_azimuthal_angle);
  let light_z = Math.cos(light_polar_angle);
  let lightDirection = vec3.fromValues(light_x, light_y, light_z);

  // Set up the viewport
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // Enable the GLSL program for the rendering
  gl.useProgram(shaderProgram);

  let modelMatrixLocation = gl.getUniformLocation(shaderProgram, "modelMatrix");
  let viewMatrixLocation = gl.getUniformLocation(shaderProgram, "viewMatrix");
  let projectionMatrixLocation = gl.getUniformLocation(shaderProgram, "projectionMatrix");

  let viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, camera_position, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

  let projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, camera_fov, gl.viewportWidth / gl.viewportHeight, 0.1, 50);

  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);  

  gl.bindVertexArray(cube_vao);
  gl.uniformMatrix4fv(modelMatrixLocation, false, mat4.fromTranslation(mat4.create(), vec3.fromValues(-1.5, 0, 0)));
  gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length / 3);

  gl.bindVertexArray(cube_vao);
  gl.uniformMatrix4fv(modelMatrixLocation, false, mat4.fromTranslation(mat4.create(), vec3.fromValues(1.5, 0, 0)));
  gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length / 3);

  gl.bindVertexArray(sphere_vao);
  gl.uniformMatrix4fv(modelMatrixLocation, false, mat4.fromTranslation(mat4.create(), vec3.fromValues(0.0, 0, 0)));
  gl.drawArrays(gl.TRIANGLES, 0, sphere_vertices.length / 3);

  gl.bindVertexArray(plane_vao);

  let plane_modelMatrix = mat4.create();
  mat4.fromTranslation(plane_modelMatrix, vec3.fromValues(0, -0.51, 0));
  mat4.scale(plane_modelMatrix, plane_modelMatrix, vec3.fromValues(20, 20, 20));

  gl.uniformMatrix4fv(modelMatrixLocation, false, plane_modelMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, plane_vertices.length / 3);

  window.requestAnimationFrame(function () { draw(); });
}
