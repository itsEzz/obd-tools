<script lang="ts">
	import CopyButton from '$lib/components/common/copy-button.svelte';
	import DialogDrawer from '$lib/components/common/dialog-drawer.svelte';
	import ContentWindow from '$lib/components/layout/content-window.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { generatePrCodesBBCodeTable, lookupPrCodes } from '$lib/logic/pr-codes';
	import { m } from '$lib/paraglide/messages';
	import {
		prCodesFormInputSchema,
		prCodesFormOutputSchema,
		prCodesParamsSchema,
		type PrCodesResult
	} from '$lib/schemas/pr-codes';
	import { defaultSearchParamsOptions } from '$lib/search-params';
	import { copyText } from '$lib/utils/copy';
	import { scrollIntoView } from '$lib/utils/scroll';
	import EmptyIcon from 'phosphor-svelte/lib/EmptyIcon';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import { useSearchParams } from 'runed/kit';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	// Variables & States
	let openFaq = $state<boolean>(false);
	let prCodesResult = $state<PrCodesResult | null>(null);
	const params = useSearchParams(prCodesParamsSchema, defaultSearchParamsOptions);

	const form = superForm(
		defaults(
			{ codes: params.codes, onlyFoundCodes: params.onlyFoundCodes },
			zod4(prCodesFormInputSchema)
		),
		{
			SPA: true,
			resetForm: false,
			validators: zod4(prCodesFormInputSchema),
			validationMethod: 'oninput',
			autoFocusOnError: false,
			onChange(event) {
				params.codes = event.get('codes');
				params.onlyFoundCodes = event.get('onlyFoundCodes');
			},
			onUpdate({ form }) {
				if (!form.valid) return;

				const parsedCodes = prCodesFormOutputSchema.safeParse(form.data);

				if (!parsedCodes.success) {
					toast.error(m.generic_error_message_title(), {
						description: m.generic_error_message_description()
					});
					prCodesResult = null;
					return;
				}

				const result = lookupPrCodes(parsedCodes.data.codes, form.data.onlyFoundCodes);
				if (!result.ok) {
					toast.error(m.generic_error_message_title(), {
						description: m.generic_error_message_description()
					});
					prCodesResult = null;
					return;
				}

				prCodesResult = result.data;
			},
			onUpdated() {
				scrollIntoView('pr-codes-result');
			}
		}
	);

	const {
		form: formData,
		constraints,
		allErrors,
		submitting,
		tainted,
		isTainted,
		enhance,
		validateForm,
		submit
	} = form;

	const canSubmit = $derived<boolean>(
		$allErrors.length === 0 && !$submitting && isTainted($tainted)
	);
	const showResult = $derived<boolean>(
		prCodesResult !== null && $allErrors.length === 0 && !$submitting && !isTainted($tainted)
	);

	// Handlers
	async function handleCopyBBCode(): Promise<boolean> {
		if (!prCodesResult) return false;
		return await copyText(generatePrCodesBBCodeTable(prCodesResult, $formData.codes));
	}

	function handleClickOpenFaq() {
		openFaq = true;
	}

	// Lifecycle
	onMount(async () => {
		const result = await validateForm({ update: true });
		if (result.valid) submit();
	});
</script>

<DialogDrawer bind:open={openFaq}>
	{#snippet body()}
		<Tabs.Root value="faq" class="mt-2">
			<Tabs.List class="w-full">
				<Tabs.Trigger value="faq">{m.pr_codes_faq_label()}</Tabs.Trigger>
				<Tabs.Trigger value="example">{m.pr_codes_faq_example_label()}</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="faq">
				<div class="chat chat-end">
					<div class="chat-bubble bg-primary text-primary-foreground">
						{m.pr_codes_faq_question_1()}
					</div>
				</div>
				<div class="chat chat-start">
					<div class="chat-bubble bg-secondary text-secondary-foreground">
						{m.pr_codes_faq_answer_1()}
					</div>
				</div>
				<div class="chat chat-end">
					<div class="chat-bubble bg-primary text-primary-foreground">
						{m.pr_codes_faq_question_2()}
					</div>
				</div>
				<div class="chat chat-start">
					<div class="chat-bubble bg-secondary text-secondary-foreground">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html m.pr_codes_faq_answer_2()}
					</div>
				</div>
			</Tabs.Content>
			<Tabs.Content value="example" class="w-full overflow-hidden">
				<img
					src="/pr_code_sticker.jpg"
					class="h-full w-full object-contain"
					alt={m.pr_codes_faq_example_img_alt()}
				/>
			</Tabs.Content>
		</Tabs.Root>
	{/snippet}
</DialogDrawer>

<ContentWindow title={m.navbar_pr_codes_lookup_label()} urlSearchParamsSchema={prCodesParamsSchema}>
	{#snippet body()}
		<div class="flex flex-col gap-4">
			<p class="bg-muted p-4 text-center">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html m.pr_codes_description()}
			</p>
			<div class="flex justify-center">
				<Button class="w-fit" variant="outline" onclick={handleClickOpenFaq}>
					<InfoIcon aria-hidden="true" />
					{m.additional_information_label()}
				</Button>
			</div>
			<Separator />
			<form method="POST" use:enhance class="flex flex-col gap-2">
				<Form.Field {form} name="codes">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.pr_codes_input_label()}</Form.Label>
							<Textarea
								{...props}
								{...$constraints.codes}
								minlength={3}
								placeholder="e.g. QF1 DL1 D9X D7J"
								bind:value={$formData.codes}
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="onlyFoundCodes">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center space-x-2">
								<Switch
									{...props}
									{...$constraints.onlyFoundCodes}
									bind:checked={$formData.onlyFoundCodes}
								/>
								<Label for={props.id}>{m.pr_codes_only_found_codes_label()}</Label>
							</div>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Form.Button class="w-full" disabled={!canSubmit}>
					<MagnifyingGlassIcon aria-hidden="true" />{m.pr_codes_submit_label()}
				</Form.Button>
			</form>
			{#if showResult}
				<Separator />
				{#if prCodesResult!.length === 0}
					<Item.Root variant="outline" class="p-2" id="pr-codes-result">
						<Item.Media><EmptyIcon class="size-6" /></Item.Media>
						<Item.Content>
							<Item.Title>{m.pr_codes_no_result_title()}</Item.Title>
							<Item.Description>{m.pr_codes_no_result_description()}</Item.Description>
						</Item.Content>
					</Item.Root>
				{:else}
					<Table.Root id="pr-codes-result">
						<Table.Caption>
							<CopyButton copyFn={handleCopyBBCode} text={m.copy_bbcode_button_label()} />
						</Table.Caption>
						<Table.Header>
							<Table.Row>
								<Table.Head class="text-center">
									{m.pr_codes_table_header_code()}
								</Table.Head>
								<Table.Head class="text-center">{m.pr_codes_table_header_code_group()}</Table.Head>
								<Table.Head>
									{m.pr_codes_table_header_description()}
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each prCodesResult as result (result.code)}
								<Table.Row>
									<Table.Cell class="text-center font-bold">{result.code}</Table.Cell>
									<Table.Cell class="text-center">{result.codeGroup}</Table.Cell>
									<Table.Cell>{result.description}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{/if}
			{/if}
		</div>
	{/snippet}
</ContentWindow>

<style>
	.chat {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
	}

	.chat-end {
		place-items: end;
		grid-template-columns: 1fr auto;
	}

	.chat-start {
		place-items: start;
		grid-template-columns: auto 1fr;
	}

	.chat-bubble {
		position: relative;
		display: block;
		width: fit-content;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		max-width: 90%;
		min-height: 2.25rem;
		min-width: 2.75rem;
	}

	.chat-start .chat-bubble {
		grid-column-start: 2;
	}

	.chat-end .chat-bubble {
		grid-column-start: 1;
	}
</style>
