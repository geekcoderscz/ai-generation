import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
	base: process.env.VITE_GH_ENV === 'true' ? '/ai-generation' : '',
	plugins: [preact()],
})
