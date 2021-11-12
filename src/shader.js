var vertexShaderCode =
  `#version 300 es
  in vec3 a_position;
  in vec3 a_color;

  uniform mat4 rotationMatrix;

  out vec3 v_color;

  void main() {
    gl_Position = rotationMatrix * vec4(a_position, 1.0);
    v_color = a_color;
  }`;

var fragmentShaderCode =
  `#version 300 es
  precision mediump float;

  in vec3 v_color;
  out vec4 out_color;

  void main() {
    out_color = vec4(v_color, 1.0);
  }`;


var gl; // WebGL context
var shaderProgram; // The GLSL program we will use for rendering
var triangle_vao; // The vertex array object for the triangle
var cube_vao; // The cube array object for the cube


/**
 * Function to initialize the WebGL context.
 */
function initWebGL() {
  var canvas = document.getElementById("webgl-canvas");
  gl = canvas.getContext("webgl2");

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  if (gl) {
    console.log("WebGL succesfully initialized.");
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
    console.log(name + " shader compiled succesfully.");
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


/**
 * Function to initialize the buffers.
 */
function initBuffers() {
  // Set up the vertex position for the triangle
  var triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_vertices), gl.STATIC_DRAW);

  var triangleColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_colors), gl.STATIC_DRAW);

  // Set up the vertex position for the cube
  var cubeVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vertices), gl.STATIC_DRAW);

  var cubeColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_colors), gl.STATIC_DRAW);

  // Set up the VAO for the triangle
  triangle_vao = gl.createVertexArray();
  gl.bindVertexArray(triangle_vao);

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
  var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  // Set up the VAO for the cube
  cube_vao = gl.createVertexArray();
  gl.bindVertexArray(cube_vao);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
  var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
  var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
}

/**
 * Function to draw the scene.
 */
function draw() {
  var rotation = document.getElementById("rotation");
  var rotationMatrix = mat4.create();
  mat4.fromRotation(rotationMatrix, -(rotation.value - 100) / 100 * Math.PI, vec3.fromValues(-0.2, 1, 0));

  var select = document.getElementById('item');
  var shape = select.options[select.selectedIndex].value;

  // Set up the viewport
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // Enable the GLSL program for the rendering
  gl.useProgram(shaderProgram);
  gl.uniformMatrix4fv(shaderProgram.rotationMatrix, false, rotationMatrix);

  if (shape === "triangle") {
    gl.bindVertexArray(triangle_vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  } else if (shape === "cube") {
    gl.bindVertexArray(cube_vao);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }

  window.requestAnimationFrame(function () { draw(); });
}
