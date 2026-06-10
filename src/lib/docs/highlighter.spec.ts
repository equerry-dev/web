import { describe, it, expect } from 'vitest';
import { compile } from 'mdsvex';
import { mdsvexOptions } from './highlighter.js';

async function render(source: string): Promise<string> {
	const result = await compile(source, mdsvexOptions);
	return result?.code ?? '';
}

describe('docs mdsvex pipeline', () => {
	it('highlights fenced code blocks with Shiki dual-theme variables', async () => {
		const code = await render('```ts\nconst answer = 42;\n```');
		// Shiki markup wrapped in an {@html} block, not raw text.
		expect(code).toContain('class="shiki');
		// Both palettes emitted so the theme toggle can recolour the block.
		expect(code).toContain('--shiki-light');
		expect(code).toContain('--shiki-dark');
	});

	it('falls back to plain text for an unknown language without failing', async () => {
		const code = await render('```not-a-real-lang\nplain text\n```');
		expect(code).toContain('class="shiki');
	});

	it('gives headings stable slug ids for the TOC (rehype-slug)', async () => {
		expect(await render('## Foo')).toContain('id="foo"');
		expect(await render('### Provider Setup')).toContain('id="provider-setup"');
	});
});
