import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

const alias = fs.readdirSync('./src', { withFileTypes: true })
  .filter(file => file.isDirectory())
  .map(file => ({
    find: file.name,
    replacement: path.resolve(__dirname, 'src', file.name),
  }))

export default defineConfig({ resolve: { alias } })
