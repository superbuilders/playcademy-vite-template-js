import { defineConfig } from 'vite'
import { cademyManifestPlugin } from '@playcademy/vite-plugin'

export default defineConfig({
    plugins: [
        cademyManifestPlugin({
            gameId: 'mock-game-id-from-template', // Replace with actual game ID in user's project
            gameName: 'Playcademy Vite JS Template',
            loaderVersion: 'latest', // Or specify a version
        }),
    ],
    // Optional: Add proxy for local dev if your API is on a different port
    // server: {
    //   proxy: {
    //     '/api': 'http://localhost:3000', // Adjust to your local API server
    //   },
    // },
})
