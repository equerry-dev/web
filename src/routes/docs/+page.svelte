<script lang="ts">
	import { docsNav, docHref } from '$lib/docs/nav';
</script>

<svelte:head>
	<title>Docs — Equerry</title>
	<meta
		name="description"
		content="Set up Equerry and wire your AI backends — install, set as default, and configure providers via Capability Slots."
	/>
</svelte:head>

<h1>Equerry Docs</h1>
<p>
	Set up Equerry and connect your own AI backends. The Setup guide goes in order: install the app,
	set it as your default assistant, add a provider, then route a job to it with Capability Slots.
</p>

<aside
	class="not-prose my-6 rounded-md border border-border border-l-4 border-l-primary bg-surface-2 p-4"
>
	<p class="font-semibold text-text">What works today</p>
	<p class="mt-1 text-sm text-text">
		Equerry is in early development (Phase 0). It is not on Google Play or F-Droid yet — for now you
		install it by building from source. The <strong>Chat</strong> Capability Slot is wired and ready;
		the other slots are marked “coming soon” in the app.
	</p>
</aside>

<!-- Internal docs routes; site is root-deployed. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
{#each docsNav as group (group.title)}
	<h2>{group.title}</h2>
	<ul>
		{#each group.pages as docPage (docPage.slug)}
			<li><a href={docHref(docPage.slug)}>{docPage.title}</a></li>
		{/each}
	</ul>
{/each}
<!-- eslint-enable svelte/no-navigation-without-resolve -->
