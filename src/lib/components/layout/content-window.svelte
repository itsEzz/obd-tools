<script lang="ts">
	import type { Snippet } from 'svelte';
	import { blur } from 'svelte/transition';

	// Props
	interface Props {
		title?: string;
		body: Snippet;
	}
	let { title, body }: Props = $props();
</script>

<div class="z-10 w-full max-w-3xl border p-4 backdrop-blur-sm" in:blur={{ duration: 200 }}>
	{#if title && title.length > 0}
		<h1 class="text-center text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h1>
	{/if}
	<div class="mt-4 p-1">
		{@render body()}
	</div>
</div>
