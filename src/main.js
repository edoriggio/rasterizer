import shader from "./shader.js";

/**
 * Main function to start the rasterizer.
 */
function start() {
  shader.initWebGL();
  shader.createGLSLPrograms();
  shader.initBuffers();
  shader.draw();
}

export default start;
