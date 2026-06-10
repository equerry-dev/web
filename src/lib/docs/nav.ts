/**
 * Single source of truth for the docs navigation.
 *
 * The sidebar, prev/next pagination, and active-page marking all derive from
 * `docsNav` — add or reorder a page here and every consumer follows. Pages are
 * grouped into labelled sections; order within `docsNav` (groups, then pages)
 * is the canonical reading order used by prev/next.
 */

export interface DocPage {
	/** URL slug under /docs — e.g. "getting-started" → /docs/getting-started. */
	slug: string;
	/** Label shown in the sidebar and as the page title. */
	title: string;
}

export interface DocGroup {
	/** Section heading shown in the sidebar. */
	title: string;
	pages: DocPage[];
}

export interface AdjacentPages {
	prev: DocPage | null;
	next: DocPage | null;
}

export const docsNav: DocGroup[] = [
	{
		title: 'Setup',
		pages: [
			{ slug: 'install', title: 'Install' },
			{ slug: 'default-assistant', title: 'Set as default assistant' },
			{ slug: 'add-a-provider', title: 'Add a provider' },
			{ slug: 'capability-slots', title: 'Capability Slots' }
		]
	}
];

/** The route path for a doc slug. */
export function docHref(slug: string): string {
	return `/docs/${slug}`;
}

/** Flatten the grouped nav to a single list in canonical reading order. */
export function flattenDocs(nav: DocGroup[] = docsNav): DocPage[] {
	return nav.flatMap((group) => group.pages);
}

/**
 * The pages immediately before and after `slug` in reading order.
 * `prev` is null on the first page, `next` is null on the last; both are null
 * if the slug isn't found.
 */
export function adjacent(slug: string, nav: DocGroup[] = docsNav): AdjacentPages {
	const pages = flattenDocs(nav);
	const index = pages.findIndex((page) => page.slug === slug);
	if (index === -1) return { prev: null, next: null };
	return {
		prev: index > 0 ? pages[index - 1] : null,
		next: index < pages.length - 1 ? pages[index + 1] : null
	};
}
