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
	Set up Equerry and connect your own AI backends. Start with installation, then wire providers to
	Capability Slots.
</p>

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
