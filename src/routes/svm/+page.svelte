<script lang="ts">
	import CopyButton from '$lib/components/common/copy-button.svelte';
	import DialogDrawer from '$lib/components/common/dialog-drawer.svelte';
	import ContentWindow from '$lib/components/layout/content-window.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { svmXor } from '$lib/logic/svm';
	import { m } from '$lib/paraglide/messages';
	import { svmFormSchema, svmParamsSchema } from '$lib/schemas/svm';
	import { copyText } from '$lib/utils/copy';
	import { scrollIntoView } from '$lib/utils/scroll';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import CalculatorIcon from '@lucide/svelte/icons/calculator';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { useSearchParams } from 'runed/kit';
	import { onMount } from 'svelte';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	// Variables & States
	let openTutorial = $state<boolean>(false);
	let svmResult = $state<string | null>(null);
	const params = useSearchParams(svmParamsSchema);

	const form = superForm(defaults({ value: params.value }, zod4(svmFormSchema)), {
		SPA: true,
		resetForm: false,
		validators: zod4(svmFormSchema),
		validationMethod: 'oninput',
		autoFocusOnError: false,
		onChange(event) {
			params.value = event.get('value');
		},
		onUpdate({ form }) {
			if (!form.valid) return;

			const result = svmXor(form.data.value);
			if (!result.ok) {
				setError(form, 'value', m.form_generic_error_message());
				svmResult = null;
				return;
			}

			svmResult = result.data;
		},
		onUpdated() {
			scrollIntoView('svm-result');
		}
	});

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

	const isFormValid = $derived<boolean>(
		$allErrors.length === 0 && !$submitting && isTainted($tainted)
	);
	const showResult = $derived<boolean>(
		svmResult !== null && $allErrors.length === 0 && !$submitting && !isTainted($tainted)
	);

	// Handlers
	async function handleCopyNewKey(): Promise<boolean> {
		if (!svmResult) return false;
		return await copyText(svmResult);
	}

	function handleClickOpenTutorial() {
		openTutorial = true;
	}

	// Lifecycle
	onMount(async () => {
		const result = await validateForm({ update: true });
		if (result.valid) submit();
	});
</script>

<DialogDrawer
	bind:open={openTutorial}
	title={m.svm_step_by_step_label()}
	description={m.svm_step_by_step_description()}
>
	{#snippet body()}
		<ol class="ml-4 list-decimal">
			<li>{m.svm_step_1()}</li>
			<li>{@html m.svm_step_2()}</li>
			<li>
				{@html m.svm_step_3()}
			</li>
			<li>
				{m.svm_step_4()}
			</li>
			<li>{m.svm_step_5()}</li>
			<li>
				{m.svm_step_6()}
			</li>
			<li>{m.svm_step_7()}</li>
			<li>{m.svm_step_8()}</li>
		</ol>
	{/snippet}
</DialogDrawer>

<ContentWindow title={m.navbar_svm_label()} urlSearchParamsSchema={svmParamsSchema}>
	{#snippet body()}
		<div class="flex flex-col gap-4">
			<p class="rounded-lg bg-secondary p-4 text-center">
				{@html m.svm_description()}
			</p>
			<div class="flex justify-center">
				<Button class="w-fit" variant="outline" onclick={handleClickOpenTutorial}>
					<InfoIcon aria-hidden="true" />
					{m.svm_step_by_step_label()}
				</Button>
			</div>
			<Separator />
			<form method="POST" use:enhance class="flex flex-col gap-2">
				<Form.Field {form} name="value">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.svm_input_label()}</Form.Label>
							<Input
								{...props}
								{...$constraints.value}
								minlength={4}
								maxlength={5}
								placeholder="e.g. 16835 or A9CD"
								bind:value={$formData.value}
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Form.Button class="w-full" disabled={!isFormValid}>
					<CalculatorIcon aria-hidden="true" />{m.svm_submit_label()}
				</Form.Button>
			</form>

			{#if showResult}
				<Separator />
				<Item.Root variant="outline" class="p-2" id="svm-result">
					<Item.Media><BadgeCheckIcon class="size-6" /></Item.Media>
					<Item.Content>
						<Item.Title>{m.svm_result_label()}:<b>{svmResult}</b></Item.Title>
					</Item.Content>
					<Item.Actions>
						<CopyButton copyFn={handleCopyNewKey} variant="outline" size="icon-sm" />
					</Item.Actions>
				</Item.Root>
			{/if}
		</div>
	{/snippet}
</ContentWindow>
