<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';

	// Props
	interface Props {
		open: boolean;
		onOpenChange?: (open: boolean) => void;
		title?: string | Snippet;
		description?: string | Snippet;
		body: Snippet;
		footer?: Snippet;
		drawerContentCss?: string;
		dialogContentCss?: string;
		escapeKeydownBehavior?: 'ignore' | 'close' | 'defer-otherwise-close' | 'defer-otherwise-ignore';
		interactOutsideBehavior?:
			'ignore' | 'close' | 'defer-otherwise-close' | 'defer-otherwise-ignore';
		idToFocusOnOpen?: string;
	}

	let {
		open = $bindable(),
		onOpenChange,
		title,
		description,
		body,
		footer,
		drawerContentCss,
		dialogContentCss = 'sm:max-w-106.25',
		escapeKeydownBehavior = 'close',
		interactOutsideBehavior = 'close',
		idToFocusOnOpen
	}: Props = $props();

	// Variables & States
	const isDesktop = new MediaQuery('(min-width: 768px)');
	const id = $props.id();
	const titleId = `dialog-title-${id}`;
	const descriptionId = `dialog-description-${id}`;

	// Handlers
	function handleOnOpenAutoFocus(event: Event) {
		if (!idToFocusOnOpen) return;

		event.preventDefault();
		const element = document.getElementById(idToFocusOnOpen);
		if (element) element.focus();
	}
</script>

{#if isDesktop.current}
	<Dialog.Root bind:open {onOpenChange}>
		<Dialog.Content
			class={dialogContentCss}
			{escapeKeydownBehavior}
			{interactOutsideBehavior}
			onOpenAutoFocus={handleOnOpenAutoFocus}
			aria-labelledby={titleId}
			aria-describedby={descriptionId}
		>
			<Dialog.Header>
				{#if title}
					<Dialog.Title id={titleId}>
						{#if typeof title === 'string'}
							{title}
						{:else}
							{@render title()}
						{/if}
					</Dialog.Title>
				{/if}
				{#if description}
					<Dialog.Description id={descriptionId}>
						{#if typeof description === 'string'}
							{description}
						{:else}
							{@render description()}
						{/if}
					</Dialog.Description>
				{/if}
			</Dialog.Header>
			<div id={!description ? descriptionId : undefined}>
				{@render body()}
			</div>
			{#if footer}
				<Dialog.Footer>
					{@render footer()}
				</Dialog.Footer>
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open {onOpenChange}>
		<Drawer.Content
			class={drawerContentCss}
			{escapeKeydownBehavior}
			{interactOutsideBehavior}
			onOpenAutoFocus={handleOnOpenAutoFocus}
			aria-labelledby={titleId}
			aria-describedby={descriptionId}
		>
			<Drawer.Header class="text-start">
				{#if title}
					<Drawer.Title id={titleId}>
						{#if typeof title === 'string'}
							{title}
						{:else}
							{@render title()}
						{/if}
					</Drawer.Title>
				{/if}
				{#if description}
					<Drawer.Description id={descriptionId}>
						{#if typeof description === 'string'}
							{description}
						{:else}
							{@render description()}
						{/if}
					</Drawer.Description>
				{/if}
			</Drawer.Header>
			<div
				id={!description ? descriptionId : undefined}
				class={cn('overflow-y-auto px-4 pt-1', !footer && 'pb-4')}
			>
				{@render body?.()}
			</div>
			{#if footer}
				<Drawer.Footer>
					{@render footer()}
				</Drawer.Footer>
			{/if}
		</Drawer.Content>
	</Drawer.Root>
{/if}
