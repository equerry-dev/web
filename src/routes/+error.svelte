<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>Page not found — Equerry</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section
	class="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-20 text-center"
>
	<p class="font-mono text-sm font-medium text-muted">{page.status}</p>
	<h1 class="font-display text-4xl font-bold text-text sm:text-5xl">Page not found</h1>
	<p class="text-lg text-muted">The page you were looking for doesn’t exist or may have moved.</p>
	<div class="mt-2 flex flex-wrap items-center justify-center gap-3">
		<Button href="/" variant="primary">Back to home</Button>
		<Button href="/docs" variant="ghost">Browse the docs</Button>
	</div>
</section>
