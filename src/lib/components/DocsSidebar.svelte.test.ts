import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { expect, test } from 'vitest';
import DocsSidebar from './DocsSidebar.svelte';
import type { DocGroup } from '$lib/docs/nav';

const nav: DocGroup[] = [
	{
		title: 'Getting Started',
		pages: [
			{ slug: 'install', title: 'Install' },
			{ slug: 'set-default', title: 'Set as default' }
		]
	},
	{
		title: 'Configuration',
		pages: [{ slug: 'providers', title: 'Providers' }]
	}
];

test('marks the current page with aria-current and leaves others unmarked', async () => {
	await page.viewport(1280, 800);
	const screen = render(DocsSidebar, { nav, current: 'set-default' });

	await expect
		.element(screen.getByRole('link', { name: 'Set as default' }))
		.toHaveAttribute('aria-current', 'page');
	await expect
		.element(screen.getByRole('link', { name: 'Install' }))
		.not.toHaveAttribute('aria-current');
});

// Tailwind utilities aren't loaded in component tests, so we assert the collapse
// MECHANISM via ARIA + class state rather than CSS visibility. Real responsive
// visibility (md breakpoint) is exercised against the full stylesheet in the t-6 e2e.
test('toggle collapses the list on mobile and the list stays shown at md+', async () => {
	await page.viewport(390, 844);
	const screen = render(DocsSidebar, { nav, current: 'install' });

	const toggle = screen.getByRole('button', { name: 'Documentation' });
	const list = screen
		.getByRole('navigation', { name: 'Docs' })
		.element()
		.querySelector('#docs-nav-list')!;

	// Collapsed by default on mobile: hidden, toggle reports collapsed.
	await expect.element(toggle).toHaveAttribute('aria-expanded', 'false');
	expect(list.className).toContain('hidden');
	// The list keeps `md:block` so it is always shown above the breakpoint.
	expect(list.className).toContain('md:block');

	await toggle.click();

	// Expanded: hidden class dropped, toggle reports expanded.
	await expect.element(toggle).toHaveAttribute('aria-expanded', 'true');
	expect(list.className).not.toContain('hidden');
});
