import { siteUrl } from '$lib/config/site';
import { docsNav, docHref, flattenDocs } from '$lib/docs/nav';

// Emitted as a static file at build time (adapter-static) — no server runtime.
export const prerender = true;

/** Every public, indexable route, in reading order. */
const routes: string[] = ['/', '/docs', ...flattenDocs(docsNav).map((page) => docHref(page.slug))];

export function GET() {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((path) => `\t<url><loc>${siteUrl}${path}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
