import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		// strategy without 'cookie': the site is URL-localized and must set no
		// cookies (privacy criterion c-4). Locale comes from the URL, else baseLocale.
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url', 'baseLocale']
		})
	],
	test: {
		expect: { requireAssertions: true },
		passWithNoTests: true,
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						instances: [{ browser: 'chromium' }]
					}
				}
			}
		]
	}
});
