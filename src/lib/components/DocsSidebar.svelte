<script lang="ts">
	import { docsNav, docHref, type DocGroup } from '$lib/docs/nav';

	interface Props {
		/** Grouped nav source; defaults to the canonical docsNav. */
		nav?: DocGroup[];
		/** Slug of the page currently being viewed, used to mark the active link. */
		current: string;
	}

	let { nav = docsNav, current }: Props = $props();

	// Below the md breakpoint the list collapses behind this toggle; at md+ the
	// list is always shown (md:block) and the toggle is hidden (md:hidden).
	let open = $state(false);
</script>

<nav class="text-sm" aria-label="Docs">
	<button
		type="button"
		class="flex w-full items-center justify-between rounded border border-border px-3 py-2 font-medium text-text md:hidden"
		aria-expanded={open}
		aria-controls="docs-nav-list"
		onclick={() => (open = !open)}
	>
		Documentation
		<svg
			class="h-4 w-4 transition-transform {open ? 'rotate-180' : ''}"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</button>

	<div id="docs-nav-list" class="mt-3 md:mt-0 md:block {open ? 'block' : 'hidden'}">
		{#each nav as group (group.title)}
			<div class="mb-5">
				<p class="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">{group.title}</p>
				<ul class="flex flex-col gap-0.5 border-l border-border">
					<!-- Internal docs routes; site is root-deployed. -->
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					{#each group.pages as docPage (docPage.slug)}
						{@const active = docPage.slug === current}
						<li>
							<a
								href={docHref(docPage.slug)}
								aria-current={active ? 'page' : undefined}
								class="-ml-px block border-l py-1 pl-3 {active
									? 'border-primary font-medium text-primary'
									: 'border-transparent text-muted hover:text-text'}"
							>
								{docPage.title}
							</a>
						</li>
					{/each}
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</ul>
			</div>
		{/each}
	</div>
</nav>
