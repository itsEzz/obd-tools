<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import ContentWindow from '$lib/components/layout/content-window.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { m } from '$lib/paraglide/messages';
	import HouseIcon from 'phosphor-svelte/lib/HouseIcon';
	import SvelteSeo from 'svelte-seo';

	// Variables & States
	let status = $derived<number>(page.status);
	let message = $derived<string>(
		status === 404
			? m.error_404_message()
			: status === 500
				? m.error_500_message()
				: m.error_unknown_message()
	);
</script>

<SvelteSeo title={`${m.website_title()} - ${status}`} description={message} />

<ContentWindow>
	{#snippet body()}
		<div class="flex flex-col items-center gap-6 text-center">
			<div class="text-8xl sm:text-9xl font-bold text-primary leading-none">
				{status}
			</div>
			<p class="text-lg sm:text-xl text-balance">
				{message}
			</p>
			<Button variant="outline" href={resolve('/')} data-umami-event="error-go-home">
				<HouseIcon aria-hidden="true" />
				{m.error_go_home_label()}
			</Button>
		</div>
	{/snippet}
</ContentWindow>
