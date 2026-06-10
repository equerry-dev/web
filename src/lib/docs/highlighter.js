import { codeToHtml } from 'shiki';
import { escapeSvelte } from 'mdsvex';
import rehypeSlug from 'rehype-slug';

/**
 * Light/dark Shiki themes. Both are emitted as CSS variables on every token
 * (defaultColor: false); src/routes/docs/code-theme.css picks the active set
 * based on the `html.dark` class, so code blocks follow the site theme toggle
 * with no runtime work and no third-party requests (highlighting is build-time).
 */
const THEMES = { light: 'github-light', dark: 'github-dark' };

/**
 * github-dark's comment/muted token (#6a737d) is only 3.04:1 on its #24292e
 * background — below the WCAG AA 4.5:1 threshold. Lift it to #8b949e (~4.7:1)
 * so dark code blocks pass AA. The light theme is unaffected.
 */
const COLOR_REPLACEMENTS = { 'github-dark': { '#6a737d': '#8b949e' } };

/**
 * Custom mdsvex highlighter backed by Shiki. Returns a Svelte-safe `{@html}`
 * block — escapeSvelte() neutralises the `{ } ` ` characters Shiki's markup
 * would otherwise feed into the Svelte compiler.
 *
 * @param {string} code
 * @param {string | null} [lang]
 * @returns {Promise<string>}
 */
export async function highlight(code, lang) {
	const language = lang ?? 'text';
	let html;
	try {
		html = await codeToHtml(code, {
			lang: language,
			themes: THEMES,
			defaultColor: false,
			colorReplacements: COLOR_REPLACEMENTS
		});
	} catch {
		// Unknown / unloadable language → render as plain text rather than fail the build.
		html = await codeToHtml(code, {
			lang: 'text',
			themes: THEMES,
			defaultColor: false,
			colorReplacements: COLOR_REPLACEMENTS
		});
	}
	return `{@html \`${escapeSvelte(html)}\`}`;
}

/**
 * Shared mdsvex options, imported by both svelte.config.js (the build) and the
 * pipeline test. rehype-slug gives every heading a stable id so the on-page TOC
 * can link to it.
 */
export const mdsvexOptions = {
	extensions: ['.svx', '.md'],
	highlight: { highlighter: highlight },
	rehypePlugins: [rehypeSlug]
};

/**
 * @typedef {Object} TocHeading
 * @property {number} depth heading level (2 for h2, 3 for h3)
 * @property {string} id    slug id assigned by rehype-slug
 * @property {string} text  visible heading text
 */

/**
 * Collect h2/h3 headings (with their rehype-slug ids) from a rendered container.
 * The docs layout calls this on the article element to feed the on-page TOC.
 *
 * @param {ParentNode} root
 * @returns {TocHeading[]}
 */
export function extractHeadings(root) {
	return Array.from(root.querySelectorAll('h2[id], h3[id]')).map((el) => ({
		depth: el.tagName === 'H2' ? 2 : 3,
		id: /** @type {HTMLElement} */ (el).id,
		text: el.textContent?.trim() ?? ''
	}));
}
