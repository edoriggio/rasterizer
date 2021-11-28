/**
 * Main function to start the rasterizer.
 */
function start() {
  initWebGL();
  createGLSLPrograms();
  initBuffers();
  draw();
}
