<script lang="ts">
	import { page } from '$app/state';
	import DocsSidebar from '$lib/components/DocsSidebar.svelte';
	import DocsToc from '$lib/components/DocsToc.svelte';
	import DocsPrevNext from '$lib/components/DocsPrevNext.svelte';
	import { extractHeadings, type TocHeading } from '$lib/docs/highlighter';
	import './code-theme.css';

	let { children } = $props();

	// "/docs/getting-started" -> "getting-started"; "/docs" (landing) -> "".
	const slug = $derived(page.url.pathname.replace(/^\/docs\/?/, ''));
	const isDocPage = $derived(slug !== '');

	let headings = $state<TocHeading[]>([]);

	// Re-collect the on-page headings whenever the rendered page changes. Reading
	// page.url.pathname re-runs this attachment on navigation, after the new
	// content has been committed to the DOM.
	function collectHeadings(node: HTMLElement) {
		void page.url.pathname;
		headings = extractHeadings(node);
	}
</script>

<div class="mx-auto max-w-[1200px] px-5 py-10 md:flex md:gap-10">
	<aside class="mb-8 md:mb-0 md:w-56 md:shrink-0">
		<div class="md:sticky md:top-20">
			<DocsSidebar current={slug} />
		</div>
	</aside>

	<div class="flex min-w-0 flex-1 gap-10">
		<div class="min-w-0 flex-1">
			<article class="prose" {@attach collectHeadings}>
				{@render children()}
			</article>
			{#if isDocPage}
				<div class="mt-12">
					<DocsPrevNext current={slug} />
				</div>
			{/if}
		</div>

		<aside class="hidden w-56 shrink-0 xl:block">
			<div class="sticky top-20">
				<DocsToc {headings} />
			</div>
		</aside>
	</div>
</div>
