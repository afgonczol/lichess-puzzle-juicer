import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    // Base path for GitHub Pages - change to your repo name
    base: '/lichess-puzzle-juicer/',
    plugins: [
        tailwindcss(),
    ],
})
