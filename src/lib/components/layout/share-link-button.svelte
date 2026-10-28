<script lang="ts">
	import { page } from '$app/state';
	import type { Path } from '$app/types';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { m } from '#lib/paraglide/messages.js';
	import { backupConverterParamsSchema } from '#lib/schemas/backup-converter.js';
	import { codingCompareParamsSchema } from '#lib/schemas/coding-compare.js';
	import { emptySchema } from '#lib/schemas/empty.js';
	import { hexToBinaryParamsSchema } from '#lib/schemas/hex-to-binary.js';
	import { prCodesParamsSchema } from '#lib/schemas/pr-codes.js';
	import { svmParamsSchema } from '#lib/schemas/svm.js';
	import { copyText } from '#lib/utils/copy.js';
	import { shareText } from '#lib/utils/share.js';
	import ShareFatIcon from 'phosphor-svelte/lib/ShareFatIcon';
	import { toast } from 'svelte-sonner';
	import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
	import { type z } from 'zod';
	import CopyButton from '../common/copy-button.svelte';
	import DialogDrawer from '../common/dialog-drawer.svelte';

	// Types
	type PathnamesWithParams = Extract<Path, 'svm' | 'cc' | 'htb' | 'prl' | 'bc'>;

	// Variables & States
	const urlSchemaMapping: Record<PathnamesWithParams, z.ZodObject<z.ZodRawShape>> = {
		svm: svmParamsSchema,
		cc: codingCompareParamsSchema,
		htb: hexToBinaryParamsSchema,
		prl: prCodesParamsSchema,
		bc: backupConverterParamsSchema,
	};
	let openShareDialog = $state<boolean>(false);
	let includeParams = $state(true);

	const id = $props.id();
	const shareLinkId = `share-link-${id}`;
	const currentSchema = $derived(
		page.url.pathname in urlSchemaMapping
			? urlSchemaMapping[page.url.pathname as PathnamesWithParams]
			: emptySchema,
	);
	const defaultValues = $derived(getUrlDefaults(currentSchema));
	const params = $derived.by(() => {
		const result = new SvelteURLSearchParams();
		for (const [key, value] of page.url.searchParams) {
			if (Object.keys(defaultValues).includes(key)) {
				const stringDefault = String(defaultValues[key]);
				if (value !== stringDefault) result.set(key, value);
			}
		}
		return result;
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

	// Functions
	function getUrlDefaults(schema: z.ZodObject<z.ZodRawShape>): Record<string, unknown> {
		const result = schema.safeParse({});
		if (!result.success) return {};
		return result.data;
	}
</script>

<DialogDrawer
	bind:open={openShareDialog}
	title={m.share_page_dialog_title()}
	description={m.share_page_dialog_description()}
	idToFocusOnOpen={shareLinkId}
>
	{#snippet body()}
		<div class="flex flex-col gap-2 overflow-hidden">
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
				data-umami-event="share-link-copy"
			/>
			<Button class="flex-1" onclick={handleClickShareUrl} data-umami-event="share-link-share">
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
		data-umami-event="share-link-open"
	>
		<ShareFatIcon aria-hidden="true" />
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>{m.share_page_dialog_title()}</p>
	</Tooltip.Content>
</Tooltip.Root>
