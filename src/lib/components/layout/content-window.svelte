<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { m } from '$lib/paraglide/messages';
	import { emptySchema } from '$lib/schemas/empty-schema';
	import { copyText } from '$lib/utils/copy';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import { useSearchParams, type StandardSchemaV1 } from 'runed/kit';
	import type { Snippet } from 'svelte';
	import CopyButton from '../common/copy-button.svelte';
	import DialogDrawer from '../common/dialog-drawer.svelte';

	// Props
	interface Props {
		title?: string;
		urlSearchParamsSchema?: StandardSchemaV1;
		body: Snippet;
	}
	let { title, urlSearchParamsSchema = emptySchema, body }: Props = $props();

	// Variables & States
	let openShareDialog = $state<boolean>(false);
	let includeParams = $state(true);

	const id = $props.id();
	const shareLinkId = `share-link-${id}`;
	const params = $derived.by(() => {
		const searchParams = useSearchParams(urlSearchParamsSchema).toURLSearchParams();
		searchParams.forEach((value, key) => {
			if (!value) searchParams.delete(key);
		});
		return searchParams;
	});

	let shareLink = $derived.by<string>(() => {
		const newUrl = new URL(page.url.pathname, page.url.origin);
		if (includeParams && params.size > 0) newUrl.search = params.toString();
		return newUrl.toString();
	});

	// Handlers
	async function handleCopyLink() {
		return await copyText(shareLink);
	}

	async function handleOpenShareDialog() {
		openShareDialog = true;
	}
</script>

<DialogDrawer
	bind:open={openShareDialog}
	title={m.share_page_dialog_title()}
	description={m.share_page_dialog_description()}
	idToFocusOnOpen={shareLinkId}
>
	{#snippet body()}
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<Input value={shareLink} readonly id={shareLinkId} />
				<CopyButton copyFn={handleCopyLink} variant="outline" />
			</div>
			{#if urlSearchParamsSchema && params.size > 0}
				<div class="flex items-center space-x-2">
					<Switch id="include-params" bind:checked={includeParams} />
					<Label for="include-params">{m.share_page_dialog_include_params_label()}</Label>
				</div>
			{/if}
		</div>
	{/snippet}
</DialogDrawer>

<div class="mockup-window relative m-2 w-fit max-w-3xl border">
	<Button
		class="absolute top-1.5 right-2"
		size="icon"
		variant="outline"
		onclick={handleOpenShareDialog}
		aria-label={m.share_page_dialog_title()}
	>
		<Share2Icon aria-hidden="true" />
	</Button>
	<div class="flex justify-center border-t px-4 py-5">
		<div class="flex flex-col">
			{#if title && title.length > 0}
				<div class="text-center">
					<h1 class="text-4xl font-bold">{title}</h1>
				</div>
			{/if}
			<div class="m-4">
				{@render body()}
			</div>
		</div>
	</div>
</div>

<style>
	.mockup-window {
		position: relative;
		overflow: hidden;
		overflow-x: auto;
		display: flex;
		flex-direction: column;
		border-radius: var(--rounded-box, 1rem /* 16px */);
		padding-top: 1.25rem /* 20px */;
	}
	.mockup-window:before {
		content: '';
		margin-bottom: 1rem /* 16px */;
		display: block;
		aspect-ratio: 1 / 1;
		height: 0.75rem /* 12px */;
		flex-shrink: 0;
		align-self: flex-start;
		border-radius: 9999px;
		opacity: 0.3;
		box-shadow:
			1.4em 0,
			2.8em 0,
			4.2em 0;
	}
</style>
