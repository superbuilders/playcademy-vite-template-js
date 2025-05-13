import { defineConfig } from 'vite'
import { cademyManifestPlugin } from '@playcademy/vite-plugin'

export default defineConfig({
    plugins: [
        cademyManifestPlugin({
            entryPoint: 'index.html',
            bootMode: 'iframe',
        }),
    ],
    base: './',
})
