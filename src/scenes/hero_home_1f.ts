import * as S from '../tilemap/sprites'
import { canvas_render } from '../canvas'
import {
  LAYER_0, LAYER_MAX, PLAYER_MOVE_TYPE, player_set, sprite_id_get, TILE_STRIDE,
  tilemap_load, tilemap_set
} from '../tilemap'
import { hero_home_2f } from './hero_home_2f'

function onplayermove() {
  if (!player)
    throw new Error('!player')
  if (player.x === 10 && player.y === 1) {
    window.removeEventListener(PLAYER_MOVE_TYPE, onplayermove)
    hero_home_2f()
    player_set(9, 1)
  }
}

export function hero_home_1f() {
  tilemap_load()
  if (!tilemap)
    throw new Error('!tilemap')
  tilemap.width = 12
  tilemap.height = 10
  const area = tilemap.width * tilemap.height
  tilemap.tiles = new Uint8Array(LAYER_MAX * area * TILE_STRIDE)
  // floor
  for (let x = 0; x < tilemap.width; x++) {
    tilemap_set(LAYER_0, x, 0, sprite_id_get(12, 1))
    tilemap_set(LAYER_0, x, 1, sprite_id_get(13, 1))
    for (let y = 2; y < tilemap.height - 1; y++) {
      tilemap_set(LAYER_0, x, y, sprite_id_get(y == 2 || x == 0 ? 14 : 15, 1))
    }
  }
  S.tv(5, 0)
  S.window(6, 0)
  S.rug(9, 2)
  S.carpet(3, 3, 6, 4)
  S.plant(0, 6)
  S.plant(11, 6)
  S.stairs_up_to_right(10, 1)
  player_set(9, 1)
  window.addEventListener(PLAYER_MOVE_TYPE, onplayermove)
  canvas_render()
}