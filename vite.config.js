import { defineConfig } from 'vite'

import { playcademy } from '@playcademy/vite-plugin'

export default defineConfig({
    plugins: [playcademy()],
    base: './',
})
