<script lang="ts">
	import ContentWindow from '$lib/components/layout/content-window.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { codingCompare } from '$lib/logic/coding-compare';
	import { m } from '$lib/paraglide/messages';
	import { codingCompareSchemaWithDefault } from '$lib/schemas/coding-compare';
	import type { CodingCompareResult } from '$lib/types/coding-compare';
	import CalculatorIcon from '@lucide/svelte/icons/calculator';
	import { useSearchParams } from 'runed/kit';
	import { onMount } from 'svelte';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	// Variables & States
	let codingCompareResult = $state<CodingCompareResult[] | null>(null);
	const params = useSearchParams(codingCompareSchemaWithDefault);

	const form = superForm(
		defaults(
			{ value1: params.value1, value2: params.value2 },
			zod4(codingCompareSchemaWithDefault)
		),
		{
			SPA: true,
			resetForm: false,
			validators: zod4(codingCompareSchemaWithDefault),
			validationMethod: 'oninput',
			onUpdate({ form }) {
				if (!form.valid) return;

				const result = codingCompare(form.data.value1, form.data.value2);
				if (!result.ok) {
					setError(form, 'value1', m.form_generic_error_message());
					setError(form, 'value2', m.form_generic_error_message());
					codingCompareResult = null;
					return;
				}

				codingCompareResult = result.data;
			},
			onUpdated({ form }) {
				params.value1 = form.data.value1;
				params.value2 = form.data.value2;
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
		codingCompareResult !== null && $allErrors.length === 0 && !$submitting && !isTainted()
	);

	// Lifecycle
	onMount(async () => {
		const result = await validateForm({ update: true });
		if (result.valid) submit();
	});
</script>

<ContentWindow
	title={m.navbar_coding_compare_label()}
	urlSearchParamsSchema={codingCompareSchemaWithDefault}
>
	{#snippet body()}
		<div class="flex flex-col gap-4">
			<p class="rounded-lg bg-secondary p-4 text-center">
				{@html m.coding_compare_description()}
			</p>
			<Separator />
			<form method="POST" use:enhance>
				<Form.Field {form} name="value1">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.coding_compare_input1_label()}</Form.Label>
							<Input
								{...props}
								{...$constraints.value1}
								minlength={2}
								bind:value={$formData.value1}
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors class="mb-2" />
				</Form.Field>
				<Form.Field {form} name="value2">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.coding_compare_input2_label()}</Form.Label>
							<Input
								{...props}
								{...$constraints.value2}
								minlength={2}
								bind:value={$formData.value2}
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors class="mb-2" />
				</Form.Field>
				<Form.Button class="w-full" disabled={!canSubmit}
					><CalculatorIcon aria-hidden="true" />{m.coding_compare_submit_label()}</Form.Button
				>
			</form>
			{#if showResult}
				<!-- Result will be displayed here -->
			{/if}
		</div>
	{/snippet}
</ContentWindow>
