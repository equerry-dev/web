import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import DocsIndex from './+page.svelte';
import { docsNav, docHref, flattenDocs } from '$lib/docs/nav';

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

test('renders a single "Setup" group covering the pages in walkthrough order', async () => {
	const screen = render(DocsIndex);

	// One group, titled Setup (locked page_structure decision).
	expect(docsNav).toHaveLength(1);
	expect(docsNav[0].title).toBe('Setup');
	await expect.element(screen.getByRole('heading', { name: 'Setup' })).toBeVisible();

	// Pages flatten to the ordered install -> ... -> capability-slots path.
	expect(flattenDocs().map((page) => page.slug)).toEqual([
		'install',
		'default-assistant',
		'add-a-provider',
		'capability-slots'
	]);
});

test('shows the "what works today" maturity callout', async () => {
	const screen = render(DocsIndex);

	await expect.element(screen.getByText('What works today')).toBeVisible();
	await expect.element(screen.getByText(/building from source/i)).toBeVisible();
	await expect.element(screen.getByText(/coming soon/i)).toBeVisible();
});
