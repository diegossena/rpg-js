import * as S from '../tilemap/sprites'
import { canvas_render } from '../canvas'
import {
  LAYER_0, LAYER_MAX, sprite_id_get, TILE_STRIDE,
  tilemap_load, tilemap_set,
  PLAYER_MOVE_TYPE,
  player_set
} from '../tilemap'
import { hero_home_1f } from './hero_home_1f'

function onplayermove() {
  if (!player)
    throw new Error('!player')
  if (player.x === 8 && player.y === 1) {
    window.removeEventListener(PLAYER_MOVE_TYPE, onplayermove)
    hero_home_1f()
    player_set(9, 1)
  }
}

export function hero_home_2f() {
  tilemap_load()
  if (!tilemap)
    throw new Error('!tilemap')
  tilemap.width = 11
  tilemap.height = 9
  const area = tilemap.width * tilemap.height
  tilemap.tiles = new Uint8Array(LAYER_MAX * area * TILE_STRIDE)
  // floor
  for (let x = 0; x < tilemap.width; x++) {
    tilemap_set(LAYER_0, x, 0, sprite_id_get(12, 1))
    tilemap_set(LAYER_0, x, 1, sprite_id_get(13, 1))
    for (let y = 2; y < tilemap.height; y++) {
      tilemap_set(LAYER_0, x, y, sprite_id_get(y == 2 || x == 0 ? 14 : 15, 1))
    }
  }
  S.board(10, 0)
  S.table(0, 1)
  S.computer(0, 0)
  S.counter(2, 1)
  S.bookshelf(3, 0)
  S.rug(9, 2)
  S.stairs_down_to_left(7, 1)
  S.bed(0, 4)
  S.carpet(3, 4, 5, 4)
  S.tv(5, 3)
  S.videogame(5, 5)
  window.addEventListener(PLAYER_MOVE_TYPE, onplayermove)
  canvas_render()
}