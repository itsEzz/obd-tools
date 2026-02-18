<script lang="ts">
	import { Button, type ButtonProps } from '$lib/components/ui/button/index.js';
	import { m } from '$lib/paraglide/messages';
	import { cn } from '$lib/utils';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CircleX from '@lucide/svelte/icons/circle-x';
	import Copy from '@lucide/svelte/icons/copy';
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';

	// Props
	interface Props extends Omit<ButtonProps, 'onclick'> {
		text?: string;
		copySuccessText?: string;
		copyFailedText?: string;
		copyTimeout?: number;
		copyFn: () => Promise<boolean>;
		class?: string;
	}

	let {
		text,
		copySuccessText,
		copyFailedText,
		copyTimeout = 2500,
		copyFn,
		class: classes,
		...buttonProps
	}: Props = $props();

	// Variables & States
	let timeout = $state<NodeJS.Timeout | null>(null);
	let copyStatus = $state<'idle' | 'copied' | 'failed'>('idle');

	// Handlers
	async function handleClick() {
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

<Button
	{...buttonProps}
	size={text ? buttonProps.size || 'default' : buttonProps.size || 'icon'}
	onclick={handleClick}
	class={cn(classes, copyStatus !== 'idle' && 'cursor-default')}
	aria-label={text}
	disabled={buttonProps.disabled || copyStatus !== 'idle'}
	aria-disabled={buttonProps.disabled || copyStatus !== 'idle'}
>
	{#if text}
		<span>{text}</span>
	{/if}
	{#if copyStatus === 'idle'}
		<Copy aria-hidden="true" />
	{:else if copyStatus === 'copied'}
		<CircleCheck aria-hidden="true" />
	{:else if copyStatus === 'failed'}
		<CircleX aria-hidden="true" />
	{/if}
</Button>
