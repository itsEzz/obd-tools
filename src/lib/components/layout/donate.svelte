<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { m } from '$lib/paraglide/messages';
	import { clientAppConfig } from '$lib/utils/client-app-config';
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
		href={clientAppConfig.PUBLIC_PAYPAL_DONATION_LINK}
		target="_blank"
		rel="noreferrer"
		aria-label={m.donate_label()}
	>
		<HandHeartIcon aria-hidden="true" />
		{#if !iconOnly.current}
			{m.donate_label()}
		{/if}
	</Button>
{/snippet}

{#if clientAppConfig.PUBLIC_PAYPAL_DONATION_LINK}
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
