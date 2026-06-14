<script lang="ts">
	import { page } from '$app/state';
	import type { ResolvedPathname } from '$app/types';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { m } from '$lib/paraglide/messages';
	import { backupConverterParamsSchema } from '$lib/schemas/backup-converter';
	import { codingCompareParamsSchema } from '$lib/schemas/coding-compare';
	import { emptySchema } from '$lib/schemas/empty';
	import { hexToBinaryParamsSchema } from '$lib/schemas/hex-to-binary';
	import { prCodesParamsSchema } from '$lib/schemas/pr-codes';
	import { svmParamsSchema } from '$lib/schemas/svm';
	import { copyText } from '$lib/utils/copy';
	import { shareText } from '$lib/utils/share';
	import ShareFatIcon from 'phosphor-svelte/lib/ShareFatIcon';
	import { validateSearchParams, type StandardSchemaV1 } from 'runed/kit';
	import { toast } from 'svelte-sonner';
	import { SvelteURL } from 'svelte/reactivity';
	import CopyButton from '../common/copy-button.svelte';
	import DialogDrawer from '../common/dialog-drawer.svelte';

	// Variables & States
	const urlSchemaMapping: Record<ResolvedPathname, StandardSchemaV1> = {
		'/': emptySchema,
		'/svm': svmParamsSchema,
		'/cc': codingCompareParamsSchema,
		'/htb': hexToBinaryParamsSchema,
		'/prl': prCodesParamsSchema,
		'/bc': backupConverterParamsSchema,
		'/api-docs': emptySchema
	};
	let openShareDialog = $state<boolean>(false);
	let includeParams = $state(true);

	const id = $props.id();
	const shareLinkId = `share-link-${id}`;
	const { searchParams } = $derived(
		validateSearchParams(page.url, urlSchemaMapping[page.url.pathname])
	);
	const params = $derived.by(() => {
		const _params = searchParams;
		_params.forEach((value, key) => {
			if (!value) _params.delete(key);
		});
		return _params;
	});

	const shareLink = $derived.by<string>(() => {
		const newUrl = new SvelteURL(page.url.pathname, page.url.origin);
		if (includeParams && params.size > 0) newUrl.search = params.toString();
		return newUrl.toString();
	});

	// Handlers
	async function handleCopyLink(): Promise<boolean> {
		return await copyText(shareLink);
	}

	async function handleClickOpenShareDialog() {
		openShareDialog = true;
	}

	async function handleClickShareUrl() {
		const ok = await shareText(m.website_title(), m.share_text(), shareLink);
		if (!ok) toast.error(m.share_button_toast_failure_title());
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
			<Textarea value={shareLink} readonly id={shareLinkId} class="max-h-24 min-h-fit break-all" />
			{#if params.size > 0}
				<div class="flex items-center space-x-2">
					<Switch id="include-params" bind:checked={includeParams} />
					<Label for="include-params">{m.share_page_dialog_include_params_label()}</Label>
				</div>
			{/if}
		</div>
	{/snippet}
	{#snippet footer()}
		<div class="flex flex-wrap items-center gap-2">
			<CopyButton
				copyFn={handleCopyLink}
				variant="outline"
				text={m.copy_link_text()}
				class="flex-1"
			/>
			<Button class="flex-1" onclick={handleClickShareUrl}>
				<ShareFatIcon aria-hidden="true" />
				{m.share_link_text()}
			</Button>
		</div>
	{/snippet}
</DialogDrawer>

<Tooltip.Root>
	<Tooltip.Trigger
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		aria-label={m.share_page_dialog_title()}
		onclick={handleClickOpenShareDialog}
	>
		<ShareFatIcon aria-hidden="true" />
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>{m.share_page_dialog_title()}</p>
	</Tooltip.Content>
</Tooltip.Root>
