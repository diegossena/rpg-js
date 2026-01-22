import { SPRITE_X_FLIP, SPRITE_Y_FLIP } from '../canvas'
import { LAYER_0, LAYER_1, LAYER_2, LAYER_3, sprite_id_get, tilemap_set } from '.'

export function board(x: number, y: number) {
  tilemap_set(LAYER_1, x, y, sprite_id_get(12, 2))
  tilemap_set(LAYER_1, x, y + 1, sprite_id_get(13, 2))
}
export function table(x: number, y: number) {
  const x1 = x + 1
  const y1 = y + 1
  tilemap_set(LAYER_1, x, y, sprite_id_get(2, 2), SPRITE_X_FLIP)
  tilemap_set(LAYER_1, x1, y, sprite_id_get(2, 2))
  tilemap_set(LAYER_1, x, y1, sprite_id_get(3, 2), SPRITE_X_FLIP)
  tilemap_set(LAYER_1, x1, y1, sprite_id_get(3, 2))
}
export function computer(x: number, y: number) {
  tilemap_set(LAYER_2, x, y, sprite_id_get(0, 2))
  tilemap_set(LAYER_2, x, y + 1, sprite_id_get(1, 2))
}
export function counter(x: number, y: number) {
  tilemap_set(LAYER_1, x, y, sprite_id_get(4, 2))
  tilemap_set(LAYER_1, x, y + 1, sprite_id_get(5, 2))
}
export function bookshelf(x: number, y: number) {
  const x1 = x + 1
  const y1 = y + 1
  const y2 = y + 2
  tilemap_set(LAYER_1, x, y, sprite_id_get(6, 2))
  tilemap_set(LAYER_1, x1, y, sprite_id_get(7, 2))
  tilemap_set(LAYER_1, x, y1, sprite_id_get(8, 2))
  tilemap_set(LAYER_1, x1, y1, sprite_id_get(9, 2))
  tilemap_set(LAYER_1, x, y2, sprite_id_get(10, 2))
  tilemap_set(LAYER_1, x1, y2, sprite_id_get(11, 2))
}
export function rug(x: number, y: number) {
  const y1 = y + 1
  tilemap_set(LAYER_1, x, y, sprite_id_get(14, 2))
  tilemap_set(LAYER_1, x, y1, sprite_id_get(15, 2))
}
export function stairs_down_to_left(x: number, y: number) {
  const x1 = x + 1
  const y1 = y + 1
  const y2 = y + 2
  tilemap_set(LAYER_1, x, y, sprite_id_get(0, 3))
  tilemap_set(LAYER_1, x, y1, sprite_id_get(1, 3))
  tilemap_set(LAYER_1, x1, y1, sprite_id_get(2, 3))
  tilemap_set(LAYER_1, x, y2, sprite_id_get(3, 3))
  tilemap_set(LAYER_1, x1, y2, sprite_id_get(4, 3))
  tilemap_set(LAYER_0, x, y2, sprite_id_get(14, 1))
  tilemap_set(LAYER_0, x1, y2, sprite_id_get(14, 1))
}
export function stairs_up_to_right(x: number, y: number) {
  const x1 = x + 1
  const y1 = y + 1
  const y2 = y + 2

  tilemap_set(LAYER_1, x, y, sprite_id_get(9, 4))
  tilemap_set(LAYER_1, x1, y, sprite_id_get(10, 4))

  tilemap_set(LAYER_1, x, y1, sprite_id_get(11, 4))
  tilemap_set(LAYER_1, x1, y1, sprite_id_get(12, 4))

  tilemap_set(LAYER_1, x, y2, sprite_id_get(13, 4))
  tilemap_set(LAYER_1, x1, y2, sprite_id_get(14, 4))

  tilemap_set(LAYER_0, x, y2, sprite_id_get(14, 1))
  tilemap_set(LAYER_0, x1, y2, sprite_id_get(14, 1))
}
export function bed(x: number, y: number) {
  const x1 = x + 1
  const x2 = x + 2
  const y1 = y + 1
  const y2 = y + 2
  tilemap_set(LAYER_1, x, y, sprite_id_get(5, 3))
  tilemap_set(LAYER_1, x1, y, sprite_id_get(6, 3))
  tilemap_set(LAYER_1, x2, y, sprite_id_get(7, 3))
  tilemap_set(LAYER_1, x, y1, sprite_id_get(8, 3))
  tilemap_set(LAYER_1, x1, y1, sprite_id_get(9, 3))
  tilemap_set(LAYER_1, x2, y1, sprite_id_get(10, 3))
  tilemap_set(LAYER_1, x, y2, sprite_id_get(11, 3))
  tilemap_set(LAYER_1, x1, y2, sprite_id_get(12, 3))
  tilemap_set(LAYER_1, x2, y2, sprite_id_get(13, 3))
}
export function carpet(x0: number, y0: number, width: number, height: number) {
  const x1 = x0 + width - 1
  const y1 = y0 + height - 1
  let corner_flag = 0
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      let tile_id = 0
      let flags = 0
      if ((x === x0 || x === x1) && (y === y0 || y === y1)) {
        tile_id = sprite_id_get(14, 3)
        flags = corner_flag++
      } else if (y === y0) {
        tile_id = sprite_id_get(15, 3)
      } else if (y === y1) {
        tile_id = sprite_id_get(15, 3)
        flags = SPRITE_Y_FLIP
      } else if (x === x0) {
        tile_id = sprite_id_get(0, 4)
      } else if (x === x1) {
        tile_id = sprite_id_get(0, 4)
        flags = SPRITE_X_FLIP
      } else {
        tile_id = sprite_id_get(1, 4)
      }
      tilemap_set(LAYER_1, x, y, tile_id, flags)
    }
  }
}
export function tv(x: number, y: number) {
  tilemap_set(LAYER_2, x, y, sprite_id_get(2, 4))
  tilemap_set(LAYER_2, x, y + 1, sprite_id_get(3, 4))
  tilemap_set(LAYER_2, x, y + 2, sprite_id_get(4, 4))
}
export function videogame(x: number, y: number) {
  tilemap_set(LAYER_3, x, y, sprite_id_get(5, 4))
  tilemap_set(LAYER_3, x, y + 1, sprite_id_get(6, 4))
}
export function plant(x: number, y: number) {
  tilemap_set(LAYER_1, x, y, sprite_id_get(7, 4))
  tilemap_set(LAYER_1, x, y + 1, sprite_id_get(8, 4))
}
export function window(x: number, y: number) {
  const x1 = x + 1
  const y1 = y + 1

  tilemap_set(LAYER_1, x, y, sprite_id_get(0, 5))
  tilemap_set(LAYER_1, x1, y, sprite_id_get(1, 5))
  tilemap_set(LAYER_1, x, y1, sprite_id_get(2, 5))
  tilemap_set(LAYER_1, x1, y1, sprite_id_get(3, 5))
}