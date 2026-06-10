import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import DocsPrevNext from './DocsPrevNext.svelte';
import type { DocGroup } from '$lib/docs/nav';

const nav: DocGroup[] = [
	{
		title: 'Group',
		pages: [
			{ slug: 'a', title: 'Alpha' },
			{ slug: 'b', title: 'Bravo' },
			{ slug: 'c', title: 'Charlie' }
		]
	}
];

test('first page: no prev, next links to the second page', async () => {
	const screen = render(DocsPrevNext, { current: 'a', nav });

	expect(screen.getByRole('link', { name: /^Previous/ }).elements()).toHaveLength(0);
	await expect
		.element(screen.getByRole('link', { name: 'Next: Bravo' }))
		.toHaveAttribute('href', '/docs/b');
});

test('last page: prev links to the previous page, no next', async () => {
	const screen = render(DocsPrevNext, { current: 'c', nav });

	expect(screen.getByRole('link', { name: /^Next/ }).elements()).toHaveLength(0);
	await expect
		.element(screen.getByRole('link', { name: 'Previous: Bravo' }))
		.toHaveAttribute('href', '/docs/b');
});

test('middle page: links to both neighbours', async () => {
	const screen = render(DocsPrevNext, { current: 'b', nav });

	await expect
		.element(screen.getByRole('link', { name: 'Previous: Alpha' }))
		.toHaveAttribute('href', '/docs/a');
	await expect
		.element(screen.getByRole('link', { name: 'Next: Charlie' }))
		.toHaveAttribute('href', '/docs/c');
});
