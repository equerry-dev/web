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
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ status, path, message }) => {
				// /docs is built in a later phase; its nav link 404s until then. Ignore only that.
				if (status === 404 && path === '/docs') return;
				throw new Error(message);
			}
		}
	},
	preprocess: [mdsvex(mdsvexOptions)],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
