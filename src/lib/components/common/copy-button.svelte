<script lang="ts">
	import { Button, type ButtonProps } from '#lib/components/ui/button/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { m } from '#lib/paraglide/messages.js';
	import { cn } from '#lib/utils.js';
	import CircleCheckIcon from 'phosphor-svelte/lib/CheckCircleIcon';
	import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
	import CircleXIcon from 'phosphor-svelte/lib/XCircleIcon';
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';

	// Props
	interface Props extends Omit<ButtonProps, 'onclick'> {
		text?: string;
		copyTimeout?: number;
		copyFn: () => Promise<boolean>;
		class?: string;
	}

	let { text, copyTimeout = 2500, copyFn, class: classes, ...buttonProps }: Props = $props();

	// Variables & States
	let timeout = $state<NodeJS.Timeout | null>(null);
	let copyStatus = $state<'idle' | 'copied' | 'failed'>('idle');

	// Handlers
	async function handleClickCopy() {
		if (copyStatus !== 'idle') return;
		const copySuccess = await copyFn();

		if (copySuccess) {
			toast.success(m.copy_button_toast_success_title());
			copyStatus = 'copied';
		} else {
			toast.error(m.copy_button_toast_failure_title());
			copyStatus = 'failed';
		}

		timeout = setTimeout(() => {
			copyStatus = 'idle';
		}, copyTimeout);
	}

	// Lifecycle
	onDestroy(() => {
		if (timeout) clearTimeout(timeout);
	});
</script>

{#snippet button(props?: Record<string, unknown>)}
	<Button
		{...props}
		{...buttonProps}
		size={text ? buttonProps.size || 'default' : buttonProps.size || 'icon'}
		onclick={handleClickCopy}
		class={cn(classes, copyStatus !== 'idle' && 'cursor-default')}
		aria-label={text || m.copy_button_aria_label()}
		disabled={buttonProps.disabled || copyStatus !== 'idle'}
		aria-disabled={buttonProps.disabled || copyStatus !== 'idle'}
	>
		{#if copyStatus === 'idle'}
			<CopyIcon aria-hidden="true" />
		{:else if copyStatus === 'copied'}
			<CircleCheckIcon aria-hidden="true" />
		{:else if copyStatus === 'failed'}
			<CircleXIcon aria-hidden="true" />
		{/if}
		{#if text}
			<span>{text}</span>
		{/if}
	</Button>
{/snippet}

{#if text}
	{@render button()}
{:else}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				{@render button(props)}
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>{m.copy_button_aria_label()}</p>
		</Tooltip.Content>
	</Tooltip.Root>
{/if}
