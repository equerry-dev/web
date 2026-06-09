<script lang="ts">
	import Button from './Button.svelte';
	import StoreBadges from './StoreBadges.svelte';

	const trustCues = ['No accounts', 'No trackers', 'GPL-3.0 on F-Droid'];
</script>

<section class="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
	<div>
		<h1 class="font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
			The private AI assistant that never sees your data.
		</h1>
		<p class="mt-5 max-w-prose text-lg text-muted">
			Equerry runs on your Android device and talks to AI backends you control — bring your own keys
			and wire each job to the provider you trust. No accounts, no telemetry, fully open source.
		</p>

		<ul
			class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted"
			aria-label="Privacy guarantees"
		>
			{#each trustCues as cue (cue)}
				<li class="flex items-center gap-2">
					<span class="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true"></span>{cue}
				</li>
			{/each}
		</ul>

		<div class="mt-8 flex flex-col items-start gap-5">
			<StoreBadges />
			<Button variant="ghost" href="/docs">Read the docs</Button>
		</div>
	</div>

	<figure class="justify-self-center lg:justify-self-end">
		<img
			src="/screenshots/app-placeholder.svg"
			alt="Equerry app preview"
			width="320"
			height="640"
			class="h-auto w-full max-w-[280px] rounded-2xl border border-border shadow-sm"
		/>
		<figcaption class="sr-only">
			App screenshot placeholder, replaced with a real screenshot later.
		</figcaption>
	</figure>
</section>
