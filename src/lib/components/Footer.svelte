<script lang="ts">
	import BrandMark from './BrandMark.svelte';

	const githubHref = 'https://github.com/equerry-dev/equerry';
	const fdroidHref = 'https://f-droid.org/packages/dev.equerry.app/';
	const licenseHref = 'https://github.com/equerry-dev/equerry/blob/main/LICENSE';
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-border">
	<div
		class="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row"
	>
		<BrandMark />
		<nav class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" aria-label="Footer">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="text-muted hover:text-text" href="/docs">Docs</a>
			<a class="text-muted hover:text-text" href={githubHref} rel="external">GitHub</a>
			<a class="text-muted hover:text-text" href={fdroidHref} rel="external">F-Droid</a>
			<a class="text-muted hover:text-text" href={licenseHref} rel="external">License</a>
		</nav>
		<p class="text-sm text-muted">© {year} Equerry — GPL-3.0</p>
	</div>
</footer>
