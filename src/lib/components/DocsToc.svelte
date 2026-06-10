<script lang="ts">
	import type { TocHeading } from '$lib/docs/highlighter';

	interface Props {
		/** Headings collected from the rendered page (h2/h3 with slug ids). */
		headings: TocHeading[];
		label?: string;
	}

	let { headings, label = 'On this page' }: Props = $props();
</script>

{#if headings.length > 0}
	<nav class="text-sm" aria-label={label}>
		<p class="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
		<ul class="flex flex-col gap-1 border-l border-border">
			{#each headings as heading (heading.id)}
				<li class={heading.depth === 3 ? 'pl-6' : 'pl-3'}>
					<a
						href={`#${heading.id}`}
						class="-ml-px block border-l border-transparent text-muted hover:text-text"
					>
						{heading.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
