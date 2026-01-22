import { TILE_X_FLIP, TILE_Y_FLIP } from '../canvas'
import { LAYER_0, LAYER_1, LAYER_2, LAYER_MAX, tile_id_get, TILE_STRIDE, tilemap_load, tilemap_set } from '../tilemap'

export function hero_home_2f() {
  const width = 11
  const height = 9
  const area = width * height
  const tiles = new Uint8Array(LAYER_MAX * area * TILE_STRIDE)
  tilemap_load({ width, height, tiles, offset_x: 0, offset_y: 0 })
  // floor
  for (let x = 0; x < width; x++) {
    tilemap_set(LAYER_0, x, 0, tile_id_get(12, 1))
    tilemap_set(LAYER_0, x, 1, tile_id_get(13, 1))
    for (let y = 2; y < height; y++) {
      tilemap_set(LAYER_0, x, y, tile_id_get(y == 2 || x == 0 ? 14 : 15, 1))
    }
  }
  // board
  tilemap_set(LAYER_1, 10, 0, tile_id_get(12, 2))
  tilemap_set(LAYER_1, 10, 1, tile_id_get(13, 2))
  // table
  tilemap_set(LAYER_1, 0, 1, tile_id_get(2, 2), TILE_X_FLIP)
  tilemap_set(LAYER_1, 1, 1, tile_id_get(2, 2))
  tilemap_set(LAYER_1, 0, 2, tile_id_get(3, 2), TILE_X_FLIP)
  tilemap_set(LAYER_1, 1, 2, tile_id_get(3, 2))
  // computer
  tilemap_set(LAYER_2, 0, 0, tile_id_get(0, 2))
  tilemap_set(LAYER_2, 0, 1, tile_id_get(1, 2))
  // counter
  tilemap_set(LAYER_1, 2, 1, tile_id_get(4, 2))
  tilemap_set(LAYER_1, 2, 2, tile_id_get(5, 2))
  // bookshelf
  tilemap_set(LAYER_1, 3, 0, tile_id_get(6, 2))
  tilemap_set(LAYER_1, 4, 0, tile_id_get(7, 2))
  tilemap_set(LAYER_1, 3, 1, tile_id_get(8, 2))
  tilemap_set(LAYER_1, 4, 1, tile_id_get(9, 2))
  tilemap_set(LAYER_1, 3, 2, tile_id_get(10, 2))
  tilemap_set(LAYER_1, 4, 2, tile_id_get(11, 2))
  // stair carpet
  tilemap_set(LAYER_1, 9, 2, tile_id_get(14, 2))
  tilemap_set(LAYER_1, 9, 3, tile_id_get(15, 2))
  // stair
  tilemap_set(LAYER_1, 7, 1, tile_id_get(0, 3))
  tilemap_set(LAYER_1, 7, 2, tile_id_get(1, 3))
  tilemap_set(LAYER_1, 8, 2, tile_id_get(2, 3))
  tilemap_set(LAYER_1, 7, 3, tile_id_get(3, 3))
  tilemap_set(LAYER_1, 8, 3, tile_id_get(4, 3))
  tilemap_set(LAYER_0, 7, 3, tile_id_get(14, 1))
  tilemap_set(LAYER_0, 8, 3, tile_id_get(14, 1))
  // bed
  tilemap_set(LAYER_1, 0, 4, tile_id_get(5, 3))
  tilemap_set(LAYER_1, 1, 4, tile_id_get(6, 3))
  tilemap_set(LAYER_1, 2, 4, tile_id_get(7, 3))
  tilemap_set(LAYER_1, 0, 5, tile_id_get(8, 3))
  tilemap_set(LAYER_1, 1, 5, tile_id_get(9, 3))
  tilemap_set(LAYER_1, 2, 5, tile_id_get(10, 3))
  tilemap_set(LAYER_1, 0, 6, tile_id_get(11, 3))
  tilemap_set(LAYER_1, 1, 6, tile_id_get(12, 3))
  tilemap_set(LAYER_1, 2, 6, tile_id_get(13, 3))
  // carpet
  tilemap_set(LAYER_1, 3, 4, tile_id_get(14, 3))
  for (let x = 4; x <= 6; x++) {
    tilemap_set(LAYER_1, x, 4, tile_id_get(15, 3))
  }
  tilemap_set(LAYER_1, 7, 4, tile_id_get(14, 3), TILE_X_FLIP)
  for (let y = 5; y <= 6; y++) {
    tilemap_set(LAYER_1, 3, y, tile_id_get(0, 4))
    for (let x = 4; x <= 6; x++) {
      tilemap_set(LAYER_1, x, y, tile_id_get(1, 4))
    }
    tilemap_set(LAYER_1, 7, y, tile_id_get(0, 4), TILE_X_FLIP)
  }
  tilemap_set(LAYER_1, 3, 4, tile_id_get(14, 3))
  for (let x = 4; x <= 6; x++) {
    tilemap_set(LAYER_1, x, 4, tile_id_get(15, 3))
  }
  tilemap_set(LAYER_1, 3, 7, tile_id_get(14, 3), TILE_Y_FLIP)
  for (let x = 4; x <= 6; x++) {
    tilemap_set(LAYER_1, x, 7, tile_id_get(15, 3), TILE_Y_FLIP)
  }
  tilemap_set(LAYER_1, 7, 7, tile_id_get(14, 3), TILE_X_FLIP | TILE_Y_FLIP);
  // tv
  tilemap_set(LAYER_2, 5, 3, tile_id_get(2, 4))
  tilemap_set(LAYER_2, 5, 4, tile_id_get(3, 4))
  tilemap_set(LAYER_2, 5, 5, tile_id_get(4, 4))
  tilemap_set(LAYER_2, 5, 6, tile_id_get(5, 4))
}