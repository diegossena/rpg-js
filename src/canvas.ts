import vertex_shader_glsl from 'shaders/vertex-shader.glsl?raw'
import pixel_shader_glsl from 'shaders/pixel-shader.glsl?raw'

declare global {
  var _vertices_length: number
  var _vertices_virtual: Float32Array
  var _indexes_length: number
  var _indexes_virtual: Uint16Array
}
export interface tile_t {
  id: number
  // tile_flag_t
  flags: number
}
// tile_flags_t
export const TILE_X_FLIP = 1 << 0
export const TILE_Y_FLIP = 1 << 1

export const webgl = canvas.getContext('webgl')
export const canvas_emitter = new EventTarget()
const DRAW_EVENT = new Event('draw')

export const VERTEX_SIZE = 2
export const QUAD_VERTEX_STRIDE = 16
export const QUAD_INDEX_STRIDE = 6
export const ATLAS_TILE_SIZE = 16
export const ATLAS_TILE_NDC = (1 / atlas.width) * ATLAS_TILE_SIZE
export const CANVAS_NDC_X = 2 / canvas.width
export const CANVAS_NDC_Y = 2 / canvas.height

globalThis['_vertices_length'] = 0
globalThis['_vertices_virtual'] = new Float32Array()
globalThis['_indexes_length'] = 0
globalThis['_indexes_virtual'] = new Uint16Array()

function shader_compile(type: WebGLRenderingContext["VERTEX_SHADER"] | WebGLRenderingContext["FRAGMENT_SHADER"], source: string) {
  if (!webgl)
    throw new Error('!webgl')
  const shader = webgl.createShader(type)
  if (!shader)
    throw new Error('!shader')
  webgl.shaderSource(shader, source)
  webgl.compileShader(shader)
  const success = webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)
  if (success)
    return shader
  console.info(webgl.getShaderInfoLog(shader))
  webgl.deleteShader(shader)
}
export function canvas_inicialize() {
  if (!webgl)
    throw new Error('!webgl')
  webgl.clearColor(0, 0, 0, 1)
  webgl.clear(webgl.COLOR_BUFFER_BIT)
  webgl.viewport(0, 0, canvas.width, canvas.height)
  // input_layout
  const input_layout = webgl.createProgram()
  const vertex_shader = shader_compile(webgl.VERTEX_SHADER, vertex_shader_glsl)
  if (!vertex_shader)
    throw new Error('!vertex_shader')
  webgl.attachShader(input_layout, vertex_shader)
  const pixel_shader = shader_compile(webgl.FRAGMENT_SHADER, pixel_shader_glsl)
  if (!pixel_shader)
    throw new Error('!pixel_shader')
  webgl.attachShader(input_layout, pixel_shader)
  webgl.linkProgram(input_layout)
  webgl.useProgram(input_layout)
  const vertex_attr = webgl.getAttribLocation(input_layout, 'position')
  // vertex_buffer
  const vertex_buffer = webgl.createBuffer()
  webgl.bindBuffer(webgl.ARRAY_BUFFER, vertex_buffer)
  const stride = VERTEX_SIZE * 2 * 4
  webgl.enableVertexAttribArray(vertex_attr)
  webgl.vertexAttribPointer(vertex_attr, VERTEX_SIZE, webgl.FLOAT, false, stride, 0)
  const textcoord_attr = webgl.getAttribLocation(input_layout, 'uv')
  webgl.enableVertexAttribArray(textcoord_attr)
  webgl.vertexAttribPointer(textcoord_attr, VERTEX_SIZE, webgl.FLOAT, false, stride, VERTEX_SIZE * 4)
  // index_buffer
  const index_buffer = webgl.createBuffer()
  webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, index_buffer)
  // texture
  const texture = webgl.createTexture()
  webgl.bindTexture(webgl.TEXTURE_2D, texture)
  webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, atlas)
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST)
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)
  webgl.enable(webgl.BLEND)
  webgl.blendFunc(webgl.ONE, webgl.ONE_MINUS_SRC_ALPHA);
  // scene
  requestAnimationFrame(canvas_draw)
}
export function tile_draw(
  x0: number, y0: number, x1: number, y1: number,
  x: number, y: number, flags: number
) {
  const u0 = ATLAS_TILE_NDC * x
  const v0 = ATLAS_TILE_NDC * y
  const u1 = u0 + ATLAS_TILE_NDC
  const v1 = v0 + ATLAS_TILE_NDC
  rect_draw(
    x0, y0, x1, y1,
    flags & TILE_X_FLIP ? u1 : u0,
    flags & TILE_Y_FLIP ? v1 : v0,
    flags & TILE_X_FLIP ? u0 : u1,
    flags & TILE_Y_FLIP ? v0 : v1
  );
}
export function rect_draw(
  x0: number, y0: number, x1: number, y1: number,
  u0: number, v0: number, u1: number, v1: number
) {
  const vertex_offset = _vertices_length / 4;
  // vertex0
  _vertices_virtual[_vertices_length++] = x0
  _vertices_virtual[_vertices_length++] = y0
  _vertices_virtual[_vertices_length++] = u0
  _vertices_virtual[_vertices_length++] = v0
  // vertex1
  _vertices_virtual[_vertices_length++] = x1
  _vertices_virtual[_vertices_length++] = y0
  _vertices_virtual[_vertices_length++] = u1
  _vertices_virtual[_vertices_length++] = v0
  // vertex2
  _vertices_virtual[_vertices_length++] = x1
  _vertices_virtual[_vertices_length++] = y1
  _vertices_virtual[_vertices_length++] = u1
  _vertices_virtual[_vertices_length++] = v1
  // vertex3
  _vertices_virtual[_vertices_length++] = x0
  _vertices_virtual[_vertices_length++] = y1
  _vertices_virtual[_vertices_length++] = u0
  _vertices_virtual[_vertices_length++] = v1
  // indexes
  _indexes_virtual[_indexes_length++] = vertex_offset
  _indexes_virtual[_indexes_length++] = vertex_offset + 1
  _indexes_virtual[_indexes_length++] = vertex_offset + 2
  _indexes_virtual[_indexes_length++] = vertex_offset
  _indexes_virtual[_indexes_length++] = vertex_offset + 2
  _indexes_virtual[_indexes_length++] = vertex_offset + 3
}
export function canvas_draw() {
  if (!webgl)
    throw new Error('!webgl')
  requestAnimationFrame(canvas_draw)
  _indexes_length = 0
  _vertices_length = 0
  // draw
  canvas_emitter.dispatchEvent(DRAW_EVENT)
  // render
  webgl.bufferData(webgl.ARRAY_BUFFER, _vertices_virtual, webgl.STATIC_DRAW)
  webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, _indexes_virtual, webgl.STATIC_DRAW)
  webgl.drawElements(webgl.TRIANGLES, _indexes_length, webgl.UNSIGNED_SHORT, 0)
}