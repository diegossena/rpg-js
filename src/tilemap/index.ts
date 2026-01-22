import {
  SPRITE_SIZE, QUAD_INDEX_STRIDE, QUAD_VERTEX_STRIDE, CANVAS_NDC_X,
  CANVAS_NDC_Y, tile_draw,
  canvas_render,
  CANVAS_DRAW_EVENT_TYPE,
  SPRITE_NDC
} from '../canvas'

declare global {
  var tilemap: tilemap_t | null
  var player: player_t | null
}

interface tilemap_t {
  width: number
  height: number
  tiles: Uint8Array // [tile_id, flags][]
  x: number
  y: number
}
interface tilemap_movement_t {
  time: number
  start_x: number
  start_y: number
  target_x: number
  target_y: number
}
// player_direction_t
const PLAYER_DOWN = 0
const PLAYER_LEFT = 1
const PLAYER_TOP = 2
const PLAYER_RIGHT = 3

interface player_t {
  direction: number
  x: number
  y: number
}

// movement

const MOVEMENT_DURATION = 500

// layer_t
export const LAYER_0 = 0
export const LAYER_1 = 1
export const LAYER_2 = 2
export const LAYER_3 = 3
export const LAYER_MAX = 4

export const TILE_STRIDE = 2
export const TILE_PX_SIZE = 70
export const TILE_X_NDC = TILE_PX_SIZE * CANVAS_NDC_X
export const TILE_Y_NDC = TILE_PX_SIZE * CANVAS_NDC_Y
export const TILEMAP_VISIBLE_X = canvas.width / TILE_PX_SIZE
export const TILEMAP_VISIBLE_Y = canvas.height / TILE_PX_SIZE
const TILEMAP_RENDERED_X = Math.ceil(TILEMAP_VISIBLE_X) + 1
const TILEMAP_RENDERED_Y = Math.ceil(TILEMAP_VISIBLE_Y) + 1

export const PLAYER_DRAW_EVENT_TYPE = 'playermove'
const PLAYER_DRAW_EVENT = new Event(PLAYER_DRAW_EVENT_TYPE)

globalThis['tilemap'] = null
globalThis['player'] = null
let movement: tilemap_movement_t | null = null

function _tilemap_movement() {
  if (!tilemap)
    throw new Error('!tilemap')
  if (!movement)
    throw new Error('!movement')
  let progress = (Date.now() - movement.time) / MOVEMENT_DURATION
  if (progress >= 1) {
    window.removeEventListener(CANVAS_DRAW_EVENT_TYPE, _tilemap_movement)
    tilemap.x = movement.target_x
    tilemap.y = movement.target_y
    if (player) {
      player.x += Math.round(movement.target_x - movement.start_x)
      player.y += Math.round(movement.target_y - movement.start_y)
      window.dispatchEvent(PLAYER_DRAW_EVENT)
    }
    movement = null
  } else {
    tilemap_set_offset(
      (movement.target_x - movement.start_x) * progress + movement.start_x,
      (movement.target_y - movement.start_y) * progress + movement.start_y
    )
  }
  canvas_render()
}

function tilemap_moveto(x: number, y: number) {
  if (!tilemap)
    throw new Error('!tilemap')
  movement = {
    time: Date.now(),
    start_x: tilemap.x,
    start_y: tilemap.y,
    target_x: x,
    target_y: y,
  }
  window.addEventListener(CANVAS_DRAW_EVENT_TYPE, _tilemap_movement)
  canvas_render()
}
export function tilemap_onkeydown(event: KeyboardEvent) {
  if (!tilemap)
    throw new Error('!tilemap')
  if (!movement) {
    switch (event.key) {
      case 'ArrowUp':
        tilemap_moveto(tilemap.x, tilemap.y - 1)
        if (player) {
          player.direction = PLAYER_TOP
        }
        break
      case 'ArrowDown':
        tilemap_moveto(tilemap.x, tilemap.y + 1)
        if (player) {
          player.direction = PLAYER_DOWN
        }
        break
      case 'ArrowLeft':
        tilemap_moveto(tilemap.x - 1, tilemap.y)
        if (player) {
          player.direction = PLAYER_LEFT
        }
        break
      case 'ArrowRight':
        tilemap_moveto(tilemap.x + 1, tilemap.y)
        if (player) {
          player.direction = PLAYER_RIGHT
        }
        break
    }
  }
}
export function tilemap_load() {
  if (tilemap)
    return
  const rendered_tiles = LAYER_MAX * TILEMAP_RENDERED_X * TILEMAP_RENDERED_Y;
  _vertices_virtual = new Float32Array(_vertices_virtual.length + rendered_tiles * QUAD_VERTEX_STRIDE)
  _indexes_virtual = new Uint16Array(_indexes_virtual.length + rendered_tiles * QUAD_INDEX_STRIDE)
  window.addEventListener('keydown', tilemap_onkeydown)
  window.addEventListener(CANVAS_DRAW_EVENT_TYPE, tilemap_draw)
}
export function tilemap_unload() {
  window.removeEventListener(CANVAS_DRAW_EVENT_TYPE, tilemap_draw)
  window.removeEventListener('keydown', tilemap_onkeydown)
  globalThis['tilemap'] = null
  globalThis['player'] = null
  const rendered_tiles = LAYER_MAX * TILEMAP_RENDERED_X * TILEMAP_RENDERED_Y;
  _vertices_virtual = new Float32Array(_vertices_virtual.length - (rendered_tiles + 1) * QUAD_VERTEX_STRIDE)
  _indexes_virtual = new Uint16Array(_indexes_virtual.length - (rendered_tiles + 1) * QUAD_INDEX_STRIDE)
}
function tilemap_set_offset(x: number, y: number) {
  if (!tilemap)
    throw new Error('!tilemap')
  while (x > tilemap.x) {
    tilemap.x += 1 / TILE_PX_SIZE
  }
  while (x < tilemap.x) {
    tilemap.x -= 1 / TILE_PX_SIZE
  }
  while (y > tilemap.y) {
    tilemap.y += 1 / TILE_PX_SIZE
  }
  while (y < tilemap.y) {
    tilemap.y -= 1 / TILE_PX_SIZE
  }
}
export function player_set(x: number, y: number, direction = player?.direction || PLAYER_DOWN) {
  player = { x, y, direction }
  tilemap_set_offset(x - TILEMAP_VISIBLE_X / 2 + .5, y - TILEMAP_VISIBLE_Y / 2 + .5)
}
export function sprite_id_get(x: number, y: number) {
  return x + y * SPRITE_SIZE + 1
}
export function tile_index(layer: number, x: number, y: number) {
  if (!tilemap)
    throw new Error('!tilemap')
  const area = tilemap.width * tilemap.height
  return (layer * area + y * tilemap.width + x) * TILE_STRIDE
}
export function tilemap_set(layer: number, x: number, y: number, id: number, flags = 0) {
  if (!tilemap)
    throw new Error('!tilemap')
  const index = tile_index(layer, x, y)
  tilemap.tiles[index] = id
  tilemap.tiles[index + 1] = flags
}
export function tilemap_draw() {
  if (!tilemap)
    throw new Error('!tilemap')
  const start_x = Math.floor(tilemap.x)
  const start_y = Math.floor(tilemap.y)
  const end_x = start_x + TILEMAP_RENDERED_X
  const end_y = start_y + TILEMAP_RENDERED_Y
  const start_x0 = -1 - (tilemap.x - start_x) * TILE_X_NDC
  const start_y0 = 1 + (tilemap.y - start_y) * TILE_Y_NDC
  let x0 = 0, y0 = 0, x1 = 0, y1 = 0
  let index = tile_index(0, start_x, start_y)
  for (let layer = 0; layer < LAYER_MAX; layer++) {
    y0 = start_y0
    for (let y = start_y; y < end_y; y++) {
      y1 = y0 - TILE_Y_NDC
      x0 = start_x0
      for (let x = start_x; x < end_x; x++) {
        x1 = x0 + TILE_X_NDC
        if (x >= 0 && x < tilemap.width && y >= 0 && y < tilemap.height) {
          const index = tile_index(layer, x, y)
          const tile_id = tilemap.tiles[index]
          if (tile_id) {
            const flags = tilemap.tiles[index + 1]
            tile_draw(
              x0, y0, x1, y1,
              tile_id, flags
            )
          }
        }
        index += 2
        x0 = x1
      }
      y0 = y1
    }
    if (player && layer == 3) {
      let
        top_id = 0,
        bottom_id = 0,
        flags = 0
      switch (player.direction) {
        case PLAYER_TOP:
        case PLAYER_DOWN:
          top_id = sprite_id_get(4, 5)
          bottom_id = player.direction === PLAYER_TOP ? sprite_id_get(8, 5) : sprite_id_get(5, 5)
          break
        case PLAYER_RIGHT:
          top_id = sprite_id_get(6, 5)
          bottom_id = sprite_id_get(7, 5)
          flags = 1
          break
        case PLAYER_LEFT:
          top_id = sprite_id_get(6, 5)
          bottom_id = sprite_id_get(7, 5)
          break
      }
      x0 = -SPRITE_NDC
      y0 = SPRITE_NDC + TILE_Y_NDC * .25
      x1 = x0 + TILE_X_NDC
      y1 = y0 - TILE_Y_NDC
      tile_draw(x0, y0, x1, y1, top_id, flags)
      y0 = y1
      x1 = x0 + TILE_X_NDC
      y1 = y0 - TILE_Y_NDC
      tile_draw(x0, y0, x1, y1, bottom_id, flags)
    }
  }
}

