import './style.css'
import { canvas_inicialize } from './canvas'
import { hero_home_2f } from './scenes'
import { player_set } from './tilemap'

function main() {
  canvas_inicialize()
  hero_home_2f()
  player_set(5, 6)
}
main()