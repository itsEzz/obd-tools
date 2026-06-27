<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { clientEnv } from '$lib/env';
	import { m } from '$lib/paraglide/messages';
	import HandHeartIcon from 'phosphor-svelte/lib/HandHeartIcon';
	import { MediaQuery } from 'svelte/reactivity';
	import { Button } from '../ui/button';

	// Variables & States
	const iconOnly = new MediaQuery('(max-width: 400px)');
</script>

{#snippet donateButton()}
	<Button
		variant="default"
		size={iconOnly.current ? 'icon' : 'default'}
		href={clientEnv.PUBLIC_DONATION_LINK}
		target="_blank"
		rel="external noopener noreferrer"
		aria-label={m.donate_label()}
		data-umami-event="donate"
	>
		<HandHeartIcon aria-hidden="true" />
		{#if !iconOnly.current}
			{m.donate_label()}
		{/if}
	</Button>
{/snippet}

{#if clientEnv.PUBLIC_DONATION_LINK}
	{#if iconOnly.current}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{@render donateButton()}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{m.donate_label()}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{:else}
		{@render donateButton()}
	{/if}
{/if}
