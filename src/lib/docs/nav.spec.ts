import { describe, it, expect } from 'vitest';
import { adjacent, flattenDocs, docsNav, type DocGroup } from './nav';

// A multi-group, multi-page fixture so ordering assertions are unambiguous
// regardless of how many real pages exist in `docsNav`.
const fixture: DocGroup[] = [
	{
		title: 'Group A',
		pages: [
			{ slug: 'a1', title: 'A One' },
			{ slug: 'a2', title: 'A Two' }
		]
	},
	{
		title: 'Group B',
		pages: [{ slug: 'b1', title: 'B One' }]
	}
];

describe('flattenDocs', () => {
	it('yields pages in group-then-order sequence', () => {
		expect(flattenDocs(fixture).map((page) => page.slug)).toEqual(['a1', 'a2', 'b1']);
	});

	it('defaults to docsNav and preserves its declared order', () => {
		const expected = docsNav.flatMap((group) => group.pages.map((page) => page.slug));
		expect(flattenDocs().map((page) => page.slug)).toEqual(expected);
	});
});

describe('adjacent', () => {
	it('returns null prev and the next page for the first page', () => {
		expect(adjacent('a1', fixture)).toEqual({
			prev: null,
			next: { slug: 'a2', title: 'A Two' }
		});
	});

	it('returns null next for the last page', () => {
		expect(adjacent('b1', fixture)).toEqual({
			prev: { slug: 'a2', title: 'A Two' },
			next: null
		});
	});

	it('crosses group boundaries in reading order', () => {
		expect(adjacent('a2', fixture)).toEqual({
			prev: { slug: 'a1', title: 'A One' },
			next: { slug: 'b1', title: 'B One' }
		});
	});

	it('returns both null for an unknown slug', () => {
		expect(adjacent('missing', fixture)).toEqual({ prev: null, next: null });
	});

	it('first page of the real docsNav has no prev', () => {
		const first = flattenDocs()[0];
		expect(adjacent(first.slug).prev).toBeNull();
	});

	it('last page of the real docsNav has no next', () => {
		const pages = flattenDocs();
		const last = pages[pages.length - 1];
		expect(adjacent(last.slug).next).toBeNull();
	});
});
