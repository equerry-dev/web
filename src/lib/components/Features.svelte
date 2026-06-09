<script lang="ts">
	import FeatureRow from './FeatureRow.svelte';
</script>

<section id="features" class="border-t border-border">
	<div class="mx-auto max-w-[1200px] px-5 pt-16">
		<h2 class="font-display text-3xl font-bold text-text">Why Equerry</h2>
	</div>

	<FeatureRow title="Capability-Slot" side="left" visualAlt="Capability-Slot diagram placeholder">
		<p>Wire different AI providers to different jobs — you decide which backend handles what.</p>
		<p class="mt-3">
			For example, run transcription on a fast local model and reasoning on a powerful cloud model,
			each with its own key.
		</p>
		<p class="mt-4">
			<!-- Internal route built in a later phase; site is root-deployed. -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="font-medium text-primary hover:underline" href="/docs"
				>Learn how Capability-Slots work →</a
			>
		</p>
	</FeatureRow>

	<FeatureRow
		title="Privacy is the product"
		side="right"
		visualAlt="Privacy guarantees placeholder"
	>
		<p>
			No accounts, no third-party trackers, no telemetry that identifies you. The site itself sets
			no cookies and uses only self-hosted, aggregate, no-PII analytics — it lives the same ethos as
			the app.
		</p>
	</FeatureRow>

	<FeatureRow
		title="Open source on F-Droid"
		side="left"
		visualAlt="Open-source licensing placeholder"
	>
		<p>
			Equerry is FOSS under GPL-3.0 and published on F-Droid. Every fork stays open, so the openness
			itself is the privacy guarantee — there is nothing hidden to trust.
		</p>
	</FeatureRow>
</section>
