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
	import { svmSchema, svmSchemaWithDefault } from '$lib/schemas/svm';
	import { copyText } from '$lib/utils/copy';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import CalculatorIcon from '@lucide/svelte/icons/calculator';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { useSearchParams } from 'runed/kit';
	import { onMount } from 'svelte';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	// Variables & States
	let openTutorial = $state<boolean>(false);
	let newKey = $state<string | null>(null);
	const params = useSearchParams(svmSchemaWithDefault);

	const form = superForm(defaults({ key: params.key || '' }, zod4(svmSchemaWithDefault)), {
		SPA: true,
		resetForm: false,
		validators: zod4(svmSchemaWithDefault),
		validationMethod: 'oninput',
		onUpdate({ form }) {
			if (!form.valid) return;

			const result = svmXor(form.data.key);
			if (!result.ok) {
				setError(form, 'key', m.form_generic_error_message());
				newKey = null;
				return;
			}

			newKey = result.data;
		},
		onUpdated({ form }) {
			params.key = form.data.key;
		}
	});

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
	const showNewKey = $derived<boolean>(
		newKey !== null && $allErrors.length === 0 && !$submitting && !isTainted()
	);

	// Handlers
	async function handleCopyNewKey() {
		if (!newKey) return false;
		return await copyText(newKey);
	}

	function handleOpenTutorial() {
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

<ContentWindow title={m.navbar_svm_label()} urlSearchParamsSchema={svmSchema}>
	{#snippet body()}
		<div class="flex flex-col gap-4">
			<p class="rounded-lg bg-secondary p-4 text-center">
				{@html m.svm_description()}
			</p>
			<div class="flex justify-center">
				<Button class="w-fit" variant="outline" onclick={handleOpenTutorial}>
					<InfoIcon aria-hidden="true" />
					{m.svm_step_by_step_label()}
				</Button>
			</div>
			<Separator />
			<form method="POST" use:enhance>
				<Form.Field {form} name="key">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.svm_input_label()}</Form.Label>
							<Input
								{...props}
								{...$constraints.key}
								minlength={4}
								maxlength={5}
								bind:value={$formData.key}
							/>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors class="mb-2" />
				</Form.Field>
				<Form.Button class="w-full" disabled={!canSubmit}
					><CalculatorIcon aria-hidden="true" />{m.svm_submit_label()}</Form.Button
				>
			</form>
			{#if showNewKey}
				<Item.Root variant="outline" class="p-2">
					<Item.Media><BadgeCheckIcon class="size-6" /></Item.Media>
					<Item.Content>
						<Item.Title>{m.svm_result_label()}:<b>{newKey}</b></Item.Title>
					</Item.Content>
					<Item.Actions>
						<CopyButton copyFn={handleCopyNewKey} variant="outline" size="icon-sm" />
					</Item.Actions>
				</Item.Root>
			{/if}
		</div>
	{/snippet}
</ContentWindow>
