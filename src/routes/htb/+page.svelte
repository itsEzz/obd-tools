<script lang="ts">
	import ContentWindow from '$lib/components/layout/content-window.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { generateHexToBinaryBBCodeTable, hexToBinary } from '$lib/logic/hex-to-binary';
	import { m } from '$lib/paraglide/messages';
	import { hexToBinaryFormSchema, hexToBinaryParamsSchema } from '$lib/schemas/hex-to-binary';
	import type { HexToBinaryResult } from '$lib/types/hex-to-binary';
	import { copyText } from '$lib/utils/copy';
	import { scrollIntoView } from '$lib/utils/scroll';
	import BinaryIcon from '@lucide/svelte/icons/binary';
	import { useSearchParams } from 'runed/kit';
	import { onMount } from 'svelte';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import * as Table from '$lib/components/ui/table/index.js';
	import CopyButton from '$lib/components/common/copy-button.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';

	// Variables & States
	let hexToBinaryResult = $state<HexToBinaryResult[] | null>(null);
	const params = useSearchParams(hexToBinaryParamsSchema);

	const form = superForm(
		defaults(
			{ value: params.value, onlySetBytes: params.onlySetBytes },
			zod4(hexToBinaryFormSchema)
		),
		{
			SPA: true,
			resetForm: false,
			validators: zod4(hexToBinaryFormSchema),
			validationMethod: 'oninput',
			onChange(event) {
				params.value = event.get('value');
				params.onlySetBytes = event.get('onlySetBytes');
			},
			onUpdate({ form }) {
				if (!form.valid) return;

				const result = hexToBinary(form.data.value, form.data.onlySetBytes);
				if (!result.ok) {
					setError(form, 'value', m.form_generic_error_message());
					hexToBinaryResult = null;
					return;
				}

				hexToBinaryResult = result.data;
			},
			onUpdated() {
				scrollIntoView('hex-to-binary-result');
			}
		}
	);

	const {
		form: formData,
		constraints,
		allErrors,
		submitting,
		isTainted,
		enhance,
		validateForm,
		submit
	} = form;

	const canSubmit = $derived<boolean>($allErrors.length === 0 && !$submitting && isTainted());
	const showResult = $derived<boolean>(
		hexToBinaryResult !== null && $allErrors.length === 0 && !$submitting && !isTainted()
	);

	// Handlers
	async function handleCopyBBCode() {
		if (!hexToBinaryResult) return false;
		return await copyText(generateHexToBinaryBBCodeTable(hexToBinaryResult, $formData.value));
	}

	// Lifecycle
	onMount(async () => {
		const result = await validateForm({ update: true });
		if (result.valid) submit();
	});
</script>

<ContentWindow
	title={m.navbar_hex_to_binary_label()}
	urlSearchParamsSchema={hexToBinaryParamsSchema}
>
	{#snippet body()}
		<div class="flex flex-col gap-4">
			<p class="rounded-lg bg-secondary p-4 text-center">
				{@html m.hex_to_binary_description()}
			</p>
			<Separator />
			<form method="POST" use:enhance>
				<Form.Field {form} name="value">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.hex_to_binary_input_label()}</Form.Label>
							<Input
								{...props}
								{...$constraints.value}
								minlength={2}
								bind:value={$formData.value}
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors class="mb-2" />
				</Form.Field>
				<Form.Field {form} name="onlySetBytes">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center space-x-2">
								<Switch
									{...props}
									{...$constraints.onlySetBytes}
									bind:checked={$formData.onlySetBytes}
								/>
								<Label for={props.id}>{m.hex_to_binary_only_set_bytes_label()}</Label>
							</div>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors class="mb-2" />
				</Form.Field>
				<Form.Button class="w-full" disabled={!canSubmit}>
					<BinaryIcon aria-hidden="true" />{m.hex_to_binary_submit_label()}
				</Form.Button>
			</form>
			{#if showResult}
				<!-- TODO fix horizonal scroll => must be limited to table only and not whole page -->
				<Table.Root id="hex-to-binary-result">
					<Table.Caption>
						<CopyButton copyFn={handleCopyBBCode} text={m.copy_bbcode_button_label()} />
					</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head class="text-center">
								{m.hex_to_binary_table_header_byte_number()}
							</Table.Head>
							<Table.Head class="text-center">{m.hex_to_binary_table_header_hex()}</Table.Head>
							<Table.Head class="text-center">
								{m.hex_to_binary_table_header_bit_7()}
							</Table.Head>
							<Table.Head class="text-center">
								{m.hex_to_binary_table_header_bit_6()}
							</Table.Head>
							<Table.Head class="text-center">
								{m.hex_to_binary_table_header_bit_5()}
							</Table.Head>
							<Table.Head class="text-center">
								{m.hex_to_binary_table_header_bit_4()}
							</Table.Head>
							<Table.Head class="text-center">
								{m.hex_to_binary_table_header_bit_3()}
							</Table.Head>
							<Table.Head class="text-center">
								{m.hex_to_binary_table_header_bit_2()}
							</Table.Head>
							<Table.Head class="text-center">
								{m.hex_to_binary_table_header_bit_1()}
							</Table.Head>
							<Table.Head class="text-center">
								{m.hex_to_binary_table_header_bit_0()}
							</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each hexToBinaryResult as result (result.byteNo)}
							<Table.Row>
								<Table.Cell class="text-center font-bold">{result.byteNo}</Table.Cell>
								<Table.Cell class="text-center">{result.hex}</Table.Cell>
								{#each Object.values(result.bits).reverse() as bin, index (`bin-${index}-${result.byteNo}`)}
									<Table.Cell class="text-center font-mono">
										<Checkbox readonly checked={bin} class="cursor-default" />
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{/if}
		</div>
	{/snippet}
</ContentWindow>
