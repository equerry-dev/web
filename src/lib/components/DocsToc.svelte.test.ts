import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import DocsToc from './DocsToc.svelte';
import type { TocHeading } from '$lib/docs/highlighter';

const headings: TocHeading[] = [
	{ depth: 2, id: 'intro', text: 'Intro' },
	{ depth: 3, id: 'details', text: 'Details' },
	{ depth: 2, id: 'wrap-up', text: 'Wrap Up' }
];

test('renders one jump-link per heading, each targeting its slug id', async () => {
	const screen = render(DocsToc, { headings });

	expect(screen.getByRole('link').elements()).toHaveLength(3);
	await expect
		.element(screen.getByRole('link', { name: 'Intro' }))
		.toHaveAttribute('href', '#intro');
	await expect
		.element(screen.getByRole('link', { name: 'Details' }))
		.toHaveAttribute('href', '#details');
	await expect
		.element(screen.getByRole('link', { name: 'Wrap Up' }))
		.toHaveAttribute('href', '#wrap-up');
});

test('jump-links are keyboard-focusable', async () => {
	const screen = render(DocsToc, { headings });

	const link = screen.getByRole('link', { name: 'Intro' }).element() as HTMLElement;
	link.focus();
	expect(document.activeElement).toBe(link);
});

test('renders nothing when there are no headings', async () => {
	const screen = render(DocsToc, { headings: [] });
	expect(screen.getByRole('link').elements()).toHaveLength(0);
});
