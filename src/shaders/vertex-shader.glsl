attribute vec2 position;
attribute vec2 uv;
varying highp vec2 texcoord;
void main(void) {
  gl_Position = vec4(position, 0.0, 1.0);
  texcoord = uv;
}