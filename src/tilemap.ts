import {
  ATLAS_TILE_SIZE, QUAD_INDEX_STRIDE, QUAD_VERTEX_STRIDE, CANVAS_NDC_X,
  CANVAS_NDC_Y, canvas_emitter, tile_draw
} from './canvas'

export interface tilemap_t {
  width: number
  height: number
  tiles: Uint8Array // tile_t[]
  offset_x: number
  offset_y: number
}

// layer_t
export const LAYER_0 = 0
export const LAYER_1 = 1
export const LAYER_2 = 2
export const LAYER_MAX = 3
export const TILE_STRIDE = 2
export const TILE_PX_SIZE = 70
export const TILE_X_NDC = TILE_PX_SIZE * CANVAS_NDC_X
export const TILE_Y_NDC = TILE_PX_SIZE * CANVAS_NDC_Y
export const TILEMAP_VISIBLE_X = canvas.width / TILE_PX_SIZE
export const TILEMAP_VISIBLE_Y = canvas.height / TILE_PX_SIZE

let tilemap: tilemap_t | null = null

export function tilemap_onkeydown(event: KeyboardEvent) {
  if (!tilemap)
    throw new Error('!tilemap')
  switch (event.key) {
    case 'ArrowUp':
      tilemap.offset_y -= 1
      break
    case 'ArrowDown':
      tilemap.offset_y += 1
      break
    case 'ArrowLeft':
      tilemap.offset_x -= 1
      break
    case 'ArrowRight':
      tilemap.offset_x += 1
      break
  }
}
export function tilemap_load(props: tilemap_t) {
  const tilemap_rendered_x = Math.ceil(TILEMAP_VISIBLE_X) + 1
  const tilemap_rendered_y = Math.ceil(TILEMAP_VISIBLE_Y) + 1
  const rendered_tiles = LAYER_MAX * tilemap_rendered_x * tilemap_rendered_y;
  _vertices_virtual = new Float32Array(_vertices_virtual.length + rendered_tiles * QUAD_VERTEX_STRIDE)
  _indexes_virtual = new Uint16Array(_indexes_virtual.length + rendered_tiles * QUAD_INDEX_STRIDE)
  tilemap = props
  window.addEventListener('keydown', tilemap_onkeydown)
  canvas_emitter.addEventListener('draw', tilemap_draw)
}
export function tilemap_unload() {
  canvas_emitter.removeEventListener('draw', tilemap_draw)
  tilemap = null
  const tilemap_rendered_x = Math.ceil(TILEMAP_VISIBLE_X) + 1
  const tilemap_rendered_y = Math.ceil(TILEMAP_VISIBLE_Y) + 1
  const rendered_tiles = LAYER_MAX * tilemap_rendered_x * tilemap_rendered_y;
  _vertices_virtual = new Float32Array(_vertices_virtual.length - (rendered_tiles + 1) * QUAD_VERTEX_STRIDE)
  _indexes_virtual = new Uint16Array(_indexes_virtual.length - (rendered_tiles + 1) * QUAD_INDEX_STRIDE)
}
export function tile_id_get(x: number, y: number) {
  return x + y * ATLAS_TILE_SIZE + 1
}
export function tilemap_index(layer: number, x: number, y: number) {
  if (!tilemap)
    throw new Error('!tilemap')
  const area = tilemap.width * tilemap.height
  return (layer * area + y * tilemap.width + x) * TILE_STRIDE
}
export function tilemap_set(layer: number, x: number, y: number, id: number, flags = 0) {
  if (!tilemap)
    throw new Error('!tilemap')
  const index = tilemap_index(layer, x, y)
  tilemap.tiles[index] = id
  tilemap.tiles[index + 1] = flags
}
export function tilemap_draw() {
  if (!tilemap)
    throw new Error('!tilemap')
  const tilemap_rendered_x = Math.ceil(TILEMAP_VISIBLE_X) + 1
  const tilemap_rendered_y = Math.ceil(TILEMAP_VISIBLE_Y) + 1
  const start_x = Math.floor(tilemap.offset_x)
  const start_y = Math.floor(tilemap.offset_y)
  const end_x = start_x + tilemap_rendered_x
  const end_y = start_y + tilemap_rendered_y
  const start_x0 = -1 - (tilemap.offset_x - start_x) * TILE_X_NDC
  const start_y0 = 1 + (tilemap.offset_y - start_y) * TILE_Y_NDC
  let x0 = 0, y0 = 0, x1 = 0, y1 = 0
  for (let layer = 0; layer < LAYER_MAX; layer++) {
    x0 = start_x0
    for (let x = start_x; x < end_x; x++) {
      x1 = x0 + TILE_X_NDC
      y0 = start_y0
      for (let y = start_y; y < end_y; y++) {
        y1 = y0 - TILE_Y_NDC
        // tile_draw
        if (x >= 0 && x < tilemap.width && y >= 0 && y < tilemap.height) {
          const index = tilemap_index(layer, x, y)
          const tile_id = tilemap.tiles[index]
          if (tile_id) {
            const flags = tilemap.tiles[index + 1]
            const tile_x = (tile_id - 1) % (atlas.width / ATLAS_TILE_SIZE)
            const tile_y = Math.ceil(tile_id / (atlas.height / ATLAS_TILE_SIZE)) - 1
            tile_draw(
              x0, y0, x1, y1,
              tile_x, tile_y, flags
            )
          }
        }
        y0 = y1
      }
      x0 = x1
    }
  }
}

