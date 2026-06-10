import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { mdsvexOptions } from './src/lib/docs/highlighter.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// Fallback page for unmatched paths, served by nginx as the branded 404.
		// All real routes are still prerendered; the fallback is never used for them.
		adapter: adapter({ fallback: '404.html' })
	},
	preprocess: [mdsvex(mdsvexOptions)],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
