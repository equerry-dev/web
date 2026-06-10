import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

// The Playwright webServer runs `npm run build && npm run preview`, so the
// adapter-static output exists under build/ by the time these tests run.
const BUILD = join(process.cwd(), 'build');

// route -> [prerendered file, a marker proving it's real content not a shell].
const ROUTES: Array<[string, string, string]> = [
	['/', 'index.html', 'never sees your data'],
	['/docs', 'docs.html', 'Equerry Docs'],
	['/docs/install', 'docs/install.html', 'Install Equerry'],
	['/docs/default-assistant', 'docs/default-assistant.html', 'default assistant'],
	['/docs/add-a-provider', 'docs/add-a-provider.html', 'Add a provider'],
	['/docs/capability-slots', 'docs/capability-slots.html', 'Capability Slots']
];

test.describe('static build output', () => {
	for (const [route, file, marker] of ROUTES) {
		test(`${route} is prerendered to a static ${file}`, () => {
			const full = join(BUILD, file);
			expect(existsSync(full), `${file} missing`).toBe(true);
			// Real prerendered content, not a generic SPA fallback shell.
			expect(readFileSync(full, 'utf-8')).toContain(marker);
		});
	}

	test('sitemap.xml is emitted listing every route', () => {
		const sitemap = join(BUILD, 'sitemap.xml');
		expect(existsSync(sitemap), 'sitemap.xml missing').toBe(true);
		const xml = readFileSync(sitemap, 'utf-8');
		for (const [route] of ROUTES) {
			expect(xml).toContain(`https://equerry.dev${route === '/' ? '/' : route}</loc>`);
		}
	});

	test('the 404.html fallback app shell is emitted', () => {
		// adapter-static emits 404.html as the app shell; nginx serves it for
		// unmatched paths and it hydrates into the branded error page (the rendered
		// result is asserted in-browser by error.e2e.ts). Here we just confirm the
		// fallback exists and is the real app shell, not an empty file.
		const notFound = join(BUILD, '404.html');
		expect(existsSync(notFound), '404.html missing').toBe(true);
		expect(readFileSync(notFound, 'utf-8')).toContain('/_app/');
	});
});
