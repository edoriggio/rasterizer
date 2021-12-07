import vertexShaderCode from "./shader/vertex.js";
import fragmentShaderCode from "./shader/fragment.js";
import terrainVertexShaderCode from "./shader/t_vertex.js";
import terrainFragmentShaderCode from "./shader/t_fragment.js";

var gl; // WebGL context
var shaderProgram; // The GLSL program we will use for rendering
var terrainShaderProgram; // shader program for rendering the terrain

var cube_vao; // The cube array object for the cube
var sphere_vao; // The sphere array object for the sphere
var plane_vao; // The plane array object for the plane
var terrain_vao; // the vertex array object for the terrain


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
 function createGLSLProgram(program, vertCode, fragCode){
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  compileShader(vertexShader, vertCode, gl.VERTEX_SHADER, "Vertex shader");
  
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  compileShader(fragmentShader, fragCode, gl.VERTEX_SHADER, "Fragment shader");
  
  linkProgram(program, vertexShader, fragmentShader);
}

function createGLSLPrograms(){
  shaderProgram = gl.createProgram();
  createGLSLProgram(shaderProgram, vertexShaderCode, fragmentShaderCode);

  terrainShaderProgram = gl.createProgram();
  createGLSLProgram(terrainShaderProgram, terrainVertexShaderCode, terrainFragmentShaderCode);
}


function createVAO(vao, shader, vertices, colors, normals) {
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  let normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  
  gl.bindVertexArray(vao);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  let positionAttributeLocation = gl.getAttribLocation(shader, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  let colorAttributeLocation = gl.getAttribLocation(shader, "a_color");
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  let normalAttributeLocation = gl.getAttribLocation(shader, "a_normal");
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
}


/**
 * Function to initialize the buffers.
 */
function initBuffers() {
  // cube_vao = gl.createVertexArray();
  // createVAO(cube_vao, shaderProgram, cube_vertices, cube_colors, cube_normals);

  sphere_vao = gl.createVertexArray();
  createVAO(sphere_vao, shaderProgram, sphere_vertices, sphere_colors, sphere_normals);

  // plane_vao = gl.createVertexArray();
  // createVAO(plane_vao, shaderProgram, plane_vertices, plane_colors, plane_normals);

  terrain_vao = gl.createVertexArray();

  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(terrain_vertices), gl.STATIC_DRAW);
  
  let uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(terrain_vertices), gl.STATIC_DRAW);
  
  gl.bindVertexArray(terrain_vao);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  let positionAttributeLocation = gl.getAttribLocation(terrainShaderProgram, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  let uvAttributeLocation = gl.getAttribLocation(terrainShaderProgram, "a_uv");
  gl.enableVertexAttribArray(uvAttributeLocation);
  gl.vertexAttribPointer(uvAttributeLocation, 3, gl.FLOAT, false, 0, 0);
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
  let terrain_scale = document.getElementById("terrain_scale").value / 100;
  let terrain_bias = document.getElementById("terrain_bias").value / 100;
  let water_level = document.getElementById("water_level").value / 1000;

  // Camera position
  let camera_x = camera_distance * Math.sin(camera_polar_angle) * Math.sin(camera_azimuthal_angle);
  let camera_y = camera_distance * Math.cos(camera_polar_angle);
  let camera_z = camera_distance * Math.sin(camera_polar_angle) * Math.cos(camera_azimuthal_angle);
  let camera_position = vec3.fromValues(camera_x, camera_y, camera_z);

  // Light direction
  let light_x = Math.sin(light_polar_angle) * Math.sin(light_azimuthal_angle);
  let light_y = Math.cos(light_polar_angle);
  let light_z = Math.sin(light_polar_angle) * Math.cos(light_azimuthal_angle);
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
  let lightDirectionLocation = gl.getUniformLocation(shaderProgram, "lightDirection");

  let projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, camera_fov, gl.viewportWidth / gl.viewportHeight, 0.01, 50);

  let viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, camera_position, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

  let modelMatrix = mat4.create();
  modelMatrix = mat4.scale(mat4.create(), mat4.create(), vec3.fromValues(0.1, 0.1, 0.1));
  modelMatrix = mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, 3.0, 0));

  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
  gl.uniform3fv(lightDirectionLocation, lightDirection);

  // Draw the cubes
  // gl.bindVertexArray(cube_vao);
  // gl.uniformMatrix4fv(modelMatrixLocation, false, mat4.fromTranslation(mat4.create(), vec3.fromValues(-1.5, 0, 0)));
  // gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length / 3);

  // gl.bindVertexArray(cube_vao);
  // gl.uniformMatrix4fv(modelMatrixLocation, false, mat4.fromTranslation(mat4.create(), vec3.fromValues(1.5, 0, 0)));
  // gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length / 3);

  // Draw the sphere
  gl.bindVertexArray(sphere_vao);
  gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, sphere_vertices.length / 3);

  // gl.bindVertexArray(plane_vao);

  // Draw the plane
  // let plane_modelMatrix = mat4.create();
  // mat4.fromTranslation(plane_modelMatrix, vec3.fromValues(0, -0.5, 0));
  // mat4.scale(plane_modelMatrix, plane_modelMatrix, vec3.fromValues(20, 20, 20));

  // gl.uniformMatrix4fv(modelMatrixLocation, false, plane_modelMatrix);
  // gl.drawArrays(gl.TRIANGLES, 0, plane_vertices.length / 3);

  //-----------------------------------------------
  //---------- Drawing the terrain-----------------
  //-----------------------------------------------

  gl.useProgram(terrainShaderProgram);

  let tBias = gl.getUniformLocation(terrainShaderProgram, "bias");
  let tScale = gl.getUniformLocation(terrainShaderProgram, "scale");
  let tWater = gl.getUniformLocation(terrainShaderProgram, "waterLevel");
  let tViewMatrixLocation = gl.getUniformLocation(terrainShaderProgram, "viewMatrix");
  let tModelMatrixLocation = gl.getUniformLocation(terrainShaderProgram, "modelMatrix");
  let tLightDirectionLocation = gl.getUniformLocation(terrainShaderProgram, "lightDirection");
  let tProjectionMatrixLocation = gl.getUniformLocation(terrainShaderProgram, "projectionMatrix");

  let tViewMatrix = mat4.create();
  mat4.lookAt(tViewMatrix, camera_position, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

  let tProjectionMatrix = mat4.create();
  mat4.perspective(tProjectionMatrix, camera_fov, gl.viewportWidth / gl.viewportHeight, 0.01, 50);

  for (let i = 0; i < terrainTextures.length; i++) {
    let textureLocation = gl.getUniformLocation(terrainShaderProgram, terrainTextures[i].uniformName);

    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, terrainTextures[i].glTexture);
    gl.uniform1i(textureLocation, i);
  }

  gl.uniform1f(tWater, water_level);
  gl.uniform1f(tBias, terrain_bias);
  gl.uniform1f(tScale, terrain_scale);
  gl.uniform3fv(tLightDirectionLocation, lightDirection);
  gl.uniformMatrix4fv(tModelMatrixLocation, false, mat4.create());
  gl.uniformMatrix4fv(tViewMatrixLocation, false, viewMatrix);
  gl.uniformMatrix4fv(tProjectionMatrixLocation, false, projectionMatrix);

  gl.bindVertexArray(terrain_vao);
  gl.drawArrays(gl.TRIANGLES, 0, terrain_vertices.length / 3);

  window.requestAnimationFrame(function () { draw(); });
}


// The function below creates textures and sets default parameters
function createTextures() {
  for(let i = 0; i < terrainTextures.length; i++) {
    terrainTextures[i].glTexture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, terrainTextures[i].glTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, terrainTextures[i]);
    gl.generateMipmap(gl.TEXTURE_2D);
  }
}


var leftToRead; // variable for counting all the textures that were already read from the files
var terrainTextures = []; // array for storing all the texture information; it does not need to be changed

// A list of the paths to the files with textures
var textureFiles = ['../assets/terrains/Lugano.png',
                    '../assets/textures/water/color.jpg',
                    '../assets/textures/sand/color.jpg',
                    '../assets/textures/grass/color.jpg',
                    '../assets/textures/rock/color.jpg',
                    '../assets/textures/snow/color.jpg'];

var textureVariables = ['dislacementMap',
                        'waterSampler',
                        'sandSampler',
                        'grassSampler',
                        'rockSampler',
                        'snowSampler'];


function count_down() {
  leftToRead = leftToRead - 1;

  if (leftToRead == 0) {
    start();
  }
}


function start() {
  initWebGL();
  createGLSLPrograms();
  createTextures();
  initBuffers();
  draw();
}


function main() {
  leftToRead = textureFiles.length;

  if(leftToRead == 0) {
    start();
  } else {
    for(let i = 0; i < textureFiles.length; i++) {
      terrainTextures.push(new Image());

      terrainTextures[i].src = textureFiles[i];
      terrainTextures[i].onload = count_down;
      terrainTextures[i].uniformName = textureVariables[i];
    }
  }
}

export default main;
