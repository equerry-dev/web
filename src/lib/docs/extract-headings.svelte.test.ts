import { expect, test } from 'vitest';
import { extractHeadings } from './highlighter';

// extractHeadings reads the DOM, so this runs in the browser test project.
function fragment(html: string): HTMLElement {
	const root = document.createElement('div');
	root.innerHTML = html;
	return root;
}

test('collects h2 and h3 in document order with depth, id and text', () => {
	const root = fragment(`
		<h2 id="intro">Intro</h2>
		<p>body</p>
		<h3 id="details">Details</h3>
		<h2 id="wrap-up">Wrap Up</h2>
	`);

	expect(extractHeadings(root)).toEqual([
		{ depth: 2, id: 'intro', text: 'Intro' },
		{ depth: 3, id: 'details', text: 'Details' },
		{ depth: 2, id: 'wrap-up', text: 'Wrap Up' }
	]);
});

test('ignores headings without an id and levels outside h2/h3', () => {
	const root = fragment(`
		<h1 id="title">Title</h1>
		<h2>No id</h2>
		<h2 id="kept">Kept</h2>
		<h4 id="too-deep">Too deep</h4>
	`);

	expect(extractHeadings(root)).toEqual([{ depth: 2, id: 'kept', text: 'Kept' }]);
});

test('returns an empty list when there are no qualifying headings', () => {
	expect(extractHeadings(fragment('<p>nothing here</p>'))).toEqual([]);
});
