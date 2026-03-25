<script lang="ts">
	import CopyButton from '$lib/components/common/copy-button.svelte';
	import ContentWindow from '$lib/components/layout/content-window.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { codingCompare, generateCodingCompareBBCodeTable } from '$lib/logic/coding-compare';
	import { m } from '$lib/paraglide/messages';
	import { codingCompareFormSchema, codingCompareParamsSchema } from '$lib/schemas/coding-compare';
	import { defaultSearchParamsOptions } from '$lib/search-params';
	import type { CodingCompareResult } from '$lib/types/coding-compare';
	import { copyText } from '$lib/utils/copy';
	import { scrollIntoView } from '$lib/utils/scroll';
	import DiffIcon from '@lucide/svelte/icons/diff';
	import { useSearchParams } from 'runed/kit';
	import { onMount } from 'svelte';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	// Variables & States
	let codingCompareResult = $state<CodingCompareResult[] | null>(null);
	const params = useSearchParams(codingCompareParamsSchema, defaultSearchParamsOptions);

	const form = superForm(
		defaults(
			{ value1: params.value1, value2: params.value2, onlyDiff: params.onlyDiff },
			zod4(codingCompareFormSchema)
		),
		{
			SPA: true,
			resetForm: false,
			validators: zod4(codingCompareFormSchema),
			validationMethod: 'oninput',
			autoFocusOnError: false,
			onChange(event) {
				params.value1 = event.get('value1');
				params.value2 = event.get('value2');
				params.onlyDiff = event.get('onlyDiff');
			},
			onUpdate({ form }) {
				if (!form.valid) return;

				const result = codingCompare(form.data.value1, form.data.value2, form.data.onlyDiff);
				if (!result.ok) {
					setError(form, 'value1', m.form_generic_error_message());
					setError(form, 'value2', m.form_generic_error_message());
					codingCompareResult = null;
					return;
				}

				codingCompareResult = result.data;
			},
			onUpdated() {
				scrollIntoView('coding-compare-result');
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
		codingCompareResult !== null && $allErrors.length === 0 && !$submitting && !isTainted($tainted)
	);

	// Handlers
	async function handleCopyBBCode(): Promise<boolean> {
		if (!codingCompareResult) return false;
		return await copyText(
			generateCodingCompareBBCodeTable(
				codingCompareResult,
				$formData.value1,
				$formData.value2,
				$formData.onlyDiff
			)
		);
	}

	// Lifecycle
	onMount(async () => {
		const result = await validateForm({ update: true });
		if (result.valid) submit();
	});
</script>

<ContentWindow
	title={m.navbar_coding_compare_label()}
	urlSearchParamsSchema={codingCompareParamsSchema}
>
	{#snippet body()}
		<div class="flex flex-col gap-4">
			<p class="rounded-lg bg-secondary p-4 text-center">
				{@html m.coding_compare_description()}
			</p>
			<Separator />
			<form method="POST" use:enhance class="flex flex-col gap-2">
				<Form.Field {form} name="value1">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.coding_compare_input1_label()}</Form.Label>
							<Input
								{...props}
								{...$constraints.value1}
								minlength={2}
								placeholder="e.g. 72C3B9E3BB836A8BD2E5E968D075EAE8"
								bind:value={$formData.value1}
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="value2">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.coding_compare_input2_label()}</Form.Label>
							<Input
								{...props}
								{...$constraints.value2}
								minlength={2}
								placeholder="e.g. DF88FF7C14BEEDC185CCBBAEDE6D82AB"
								bind:value={$formData.value2}
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="onlyDiff">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center space-x-2">
								<Switch {...props} {...$constraints.onlyDiff} bind:checked={$formData.onlyDiff} />
								<Label for={props.id}>{m.coding_compare_only_diff_label()}</Label>
							</div>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Form.Button class="w-full" disabled={!canSubmit}>
					<DiffIcon aria-hidden="true" />
					{m.coding_compare_submit_label()}
				</Form.Button>
			</form>
			{#if showResult}
				<!-- TODO fix horizonal scroll => must be limited to table only and not whole page -->
				<Separator />
				<Table.Root id="coding-compare-result">
					<Table.Caption>
						<CopyButton copyFn={handleCopyBBCode} text={m.copy_bbcode_button_label()} />
					</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Row></Table.Row>
							<Table.Head class="text-center" colspan={2}>
								{m.coding_compare_table_header_value1()}
							</Table.Head>
							<Table.Head class="text-center" colspan={2}>
								{m.coding_compare_table_header_value2()}
							</Table.Head>
						</Table.Row>
						<Table.Row>
							<Table.Head class="text-center">
								{m.coding_compare_table_header_byte_number()}
							</Table.Head>
							<Table.Head class="text-center">{m.coding_compare_table_header_hex()}</Table.Head>
							<Table.Head class="text-center">
								{m.coding_compare_table_header_binary()}<br />7 6 5 4 3 2 1 0
							</Table.Head>
							<Table.Head class="text-center">{m.coding_compare_table_header_hex()}</Table.Head>
							<Table.Head class="text-center">
								{m.coding_compare_table_header_binary()}<br />7 6 5 4 3 2 1 0
							</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each codingCompareResult as result (result.byteNo)}
							<Table.Row>
								<Table.Cell class="text-center font-bold">{result.byteNo}</Table.Cell>
								<Table.Cell class="text-center">{result.hex1}</Table.Cell>
								<Table.Cell class="text-center text-nowrap">
									{#each Object.values(result.bits1).reverse() as bin, index (`bin1-${index}-${String(bin)}`)}
										<span class:text-destructive={bin.differs}>
											{bin.set ? '1 ' : '0 '}
										</span>
									{/each}
								</Table.Cell>
								<Table.Cell class="text-center">{result.hex2}</Table.Cell>
								<Table.Cell class="text-center">
									{#each Object.values(result.bits2).reverse() as bin, index (`bin2-${index}-${String(bin)}`)}
										<span class:text-destructive={bin.differs}>
											{bin.set ? '1 ' : '0 '}
										</span>
									{/each}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{/if}
		</div>
	{/snippet}
</ContentWindow>
