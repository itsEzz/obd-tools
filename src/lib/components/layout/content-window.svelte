<script lang="ts">
	import type { Snippet } from 'svelte';

	// Props
	interface Props {
		title?: string;
		body: Snippet;
	}
	let { title, body }: Props = $props();
</script>

<div class="container max-w-4xl">
	{#if title && title.length > 0}
		<h1 class="text-center text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h1>
	{/if}
	<div class="mt-4 p-1">
		{@render body()}
	</div>
</div>
