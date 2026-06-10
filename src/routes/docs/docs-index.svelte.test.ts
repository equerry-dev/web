import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import DocsIndex from './+page.svelte';
import { docsNav, docHref } from '$lib/docs/nav';

test('lists every doc page from docsNav with its route href', async () => {
	const screen = render(DocsIndex);

	for (const group of docsNav) {
		await expect.element(screen.getByRole('heading', { name: group.title })).toBeVisible();
		for (const docPage of group.pages) {
			await expect
				.element(screen.getByRole('link', { name: docPage.title }))
				.toHaveAttribute('href', docHref(docPage.slug));
		}
	}
});
