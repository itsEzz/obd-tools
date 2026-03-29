<script lang="ts">
	import CopyButton from '$lib/components/common/copy-button.svelte';
	import DialogDrawer from '$lib/components/common/dialog-drawer.svelte';
	import ContentWindow from '$lib/components/layout/content-window.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { convertOBDElevenBackup } from '$lib/logic/backup-converter';
	import { m } from '$lib/paraglide/messages';
	import {
		backupConverterFormSchema,
		backupConverterParamsSchema,
		backupFormatSelectValues,
		maxFileSizeInBytes,
		type BackupConverterResult
	} from '$lib/schemas/backup-converter';
	import { defaultSearchParamsOptions } from '$lib/search-params';
	import { cn } from '$lib/utils';
	import { copyText } from '$lib/utils/copy';
	import { downloadFile } from '$lib/utils/download';
	import { toHumanReadable } from '$lib/utils/number';
	import { scrollIntoView } from '$lib/utils/scroll';
	import FileCogIcon from '@lucide/svelte/icons/file-cog';
	import FileDownIcon from '@lucide/svelte/icons/file-down';
	import InfoIcon from '@lucide/svelte/icons/info';
	import PaperClipIcon from '@lucide/svelte/icons/paperclip';
	import { useSearchParams } from 'runed/kit';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	// Variables & States
	let fileInput = $state<HTMLInputElement | null>(null);
	let openInfo = $state<boolean>(false);
	let backupConverterResult = $state<BackupConverterResult | null>(null);
	const params = useSearchParams(backupConverterParamsSchema, defaultSearchParamsOptions);

	const form = superForm(
		defaults(
			{
				delimiter: params.delimiter,
				format: params.format,
				incBasicBkpInfo: params.incBasicBkpInfo,
				incBasicCUInfo: params.incBasicCUInfo,
				incAdapData: params.incAdapData,
				incAdvIdentData: params.incAdvIdentData,
				addEmptyLinesBtwCUs: params.addEmptyLinesBtwCUs,
				addEmptyLinesBtwAdapAndAdvIdentData: params.addEmptyLinesBtwAdapAndAdvIdentData
			},
			zod4(backupConverterFormSchema)
		),
		{
			SPA: true,
			resetForm: false,
			validators: zod4(backupConverterFormSchema),
			validationMethod: 'oninput',
			autoFocusOnError: false,
			onChange(event) {
				params.delimiter = event.get('delimiter');
				params.format = event.get('format');
				params.incBasicBkpInfo = event.get('incBasicBkpInfo');
				params.incBasicCUInfo = event.get('incBasicCUInfo');
				params.incAdapData = event.get('incAdapData');
				params.incAdvIdentData = event.get('incAdvIdentData');
				params.addEmptyLinesBtwCUs = event.get('addEmptyLinesBtwCUs');
				params.addEmptyLinesBtwAdapAndAdvIdentData = event.get(
					'addEmptyLinesBtwAdapAndAdvIdentData'
				);
			},
			onUpdate({ form }) {
				if (!form.valid) return;

				const result = convertOBDElevenBackup(form.data);
				if (!result.ok) {
					toast.error(m.generic_error_message_title(), {
						description: m.generic_error_message_description()
					});
					backupConverterResult = null;
					return;
				}

				backupConverterResult = result.data;
			},
			onUpdated() {
				scrollIntoView('backup-converter-result');
			}
		}
	);

	const {
		form: formData,
		constraints,
		allErrors,
		submitting,
		tainted,
		errors,
		isTainted,
		enhance,
		validateForm,
		submit
	} = form;

	const canSubmit = $derived<boolean>(
		$allErrors.length === 0 && !$submitting && isTainted($tainted)
	);
	const showResult = $derived<boolean>(
		backupConverterResult !== null &&
			$allErrors.length === 0 &&
			!$submitting &&
			!isTainted($tainted)
	);

	// Handlers
	function handleClickOpenInfo() {
		openInfo = true;
	}

	function handleClickSelectFile() {
		fileInput?.click();
	}

	async function handleOnChangeFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			if (file.size > maxFileSizeInBytes.maxSize) {
				toast.error(m.backup_converter_file_too_big_title(), {
					description: m.backup_converter_file_too_big_description({
						readable_file_size_limit: maxFileSizeInBytes.readable
					})
				});
				target.value = '';
				return;
			}
			if (file.type === 'text/plain') {
				const text = await file.text();
				$formData.backup += text;
			} else {
				toast.error(m.backup_converter_file_type_invalid_title(), {
					description: m.backup_converter_file_type_invalid_description()
				});
			}
		}
		target.value = '';
	}

	async function handleCopyConvertedBackup(): Promise<boolean> {
		if (!backupConverterResult) return false;
		return await copyText(backupConverterResult);
	}

	function handleClickDownloadResult() {
		if (!backupConverterResult) return;
		downloadFile(backupConverterResult, 'converted_backup_obd_tools.txt');
	}

	// Lifecycle
	onMount(async () => {
		const result = await validateForm({ update: true });
		if (result.valid) submit();
	});
</script>

<DialogDrawer bind:open={openInfo} title={m.backup_converter_info_title()}>
	{#snippet body()}
		<ol class="ml-4 list-decimal">
			<li>{m.backup_converter_info_1()}</li>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<li>{@html m.backup_converter_info_2()}</li>
			<li>
				{m.backup_converter_info_3()}
			</li>
			<li>
				{m.backup_converter_info_4()}
			</li>
		</ol>
	{/snippet}
</DialogDrawer>

<ContentWindow
	title={m.navbar_backup_converter_label()}
	urlSearchParamsSchema={backupConverterParamsSchema}
>
	{#snippet body()}
		<div class="flex flex-col gap-4">
			<p class="rounded-lg bg-secondary p-4 text-center">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html m.backup_converter_description()}
			</p>
			<div class="flex justify-center">
				<Button class="w-fit" variant="outline" onclick={handleClickOpenInfo}>
					<InfoIcon aria-hidden="true" />
					{m.backup_converter_additional_information_label()}
				</Button>
			</div>
			<Separator />
			<form method="POST" use:enhance class="flex flex-col gap-2">
				<Form.Field {form} name="backup">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.backup_converter_backup_label()}</Form.Label>
							<div
								class={cn(
									'textarea-scrollbar relative rounded-lg border border-input bg-transparent transition-colors focus-within:ring-3 dark:bg-input/30',
									$errors.backup
										? 'border-destructive ring-destructive/20 dark:ring-destructive/40'
										: 'focus-within:border-ring focus-within:ring-ring/50'
								)}
							>
								<Textarea
									{...props}
									{...$constraints.backup}
									class="max-h-96 min-h-32 rounded-b-none border-none break-all focus-visible:ring-0 aria-invalid:ring-0"
									placeholder={`e.g. OBDeleven vehicle history log

Date: ${new Date().toLocaleString()}

VIN: ....
`}
									bind:value={$formData.backup}
								/>
								<div
									class="flex items-center justify-between border-t bg-transparent p-1 dark:bg-input/30"
								>
									<p class="ml-1.5 text-sm text-muted-foreground">
										{toHumanReadable($formData.backup.length)} character(s)
									</p>
									<Input
										type="file"
										accept=".txt"
										bind:ref={fileInput}
										onchange={handleOnChangeFileSelect}
										class="hidden"
									/>
									<Button variant="ghost" onclick={handleClickSelectFile}>
										<PaperClipIcon />
										{m.backup_converter_select_file_label()}
									</Button>
								</div>
							</div>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>

				<div class="flex flex-col gap-2 sm:flex-row">
					<Form.Field {form} name="delimiter" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<Label for={props.id}>{m.backup_converter_delimiter_label()}</Label>
								<Input
									{...props}
									{...$constraints.delimiter}
									minlength={2}
									placeholder="e.g. ;"
									bind:value={$formData.delimiter}
								/>
							{/snippet}
						</Form.Control>

						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="format" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<Label for={props.id}>{m.backup_converter_format_label()}</Label>
								<Select.Root
									{...props}
									{...$constraints.format}
									type="single"
									bind:value={$formData.format}
								>
									<Select.Trigger class="w-full">
										{backupFormatSelectValues.find((f) => f.value === $formData.format)?.label ??
											m.backup_converter_format_placeholder()}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											{#each backupFormatSelectValues as format (format.value)}
												<Select.Item value={format.value} label={format.label}>
													{format.label}
												</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>

						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="flex flex-col gap-2 sm:flex-row">
					<Form.Field {form} name="incBasicBkpInfo" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center space-x-2">
									<Switch
										{...props}
										{...$constraints.incBasicBkpInfo}
										bind:checked={$formData.incBasicBkpInfo}
									/>
									<Label for={props.id}>
										{m.backup_converter_include_basic_backup_information_label()}
									</Label>
								</div>
							{/snippet}
						</Form.Control>

						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="incBasicCUInfo" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center space-x-2">
									<Switch
										{...props}
										{...$constraints.incBasicCUInfo}
										bind:checked={$formData.incBasicCUInfo}
									/>
									<Label for={props.id}>
										{m.backup_converter_include_basic_control_unit_information_label()}
									</Label>
								</div>
							{/snippet}
						</Form.Control>

						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="flex flex-col gap-2 sm:flex-row">
					<Form.Field {form} name="incAdapData" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center space-x-2">
									<Switch
										{...props}
										{...$constraints.incAdapData}
										bind:checked={$formData.incAdapData}
									/>
									<Label for={props.id}>{m.backup_converter_include_adaptation_data_label()}</Label>
								</div>
							{/snippet}
						</Form.Control>

						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="incAdvIdentData" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center space-x-2">
									<Switch
										{...props}
										{...$constraints.incAdvIdentData}
										bind:checked={$formData.incAdvIdentData}
									/>
									<Label for={props.id}>
										{m.backup_converter_include_advanced_identification_data_label()}
									</Label>
								</div>
							{/snippet}
						</Form.Control>

						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="flex flex-col gap-2 sm:flex-row">
					<Form.Field {form} name="addEmptyLinesBtwCUs" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center space-x-2">
									<Switch
										{...props}
										{...$constraints.addEmptyLinesBtwCUs}
										bind:checked={$formData.addEmptyLinesBtwCUs}
									/>
									<Label for={props.id}>
										{m.backup_converter_add_empty_lines_between_control_units_label()}
									</Label>
								</div>
							{/snippet}
						</Form.Control>

						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="addEmptyLinesBtwAdapAndAdvIdentData" class="w-full">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center space-x-2">
									<Switch
										{...props}
										{...$constraints.addEmptyLinesBtwAdapAndAdvIdentData}
										bind:checked={$formData.addEmptyLinesBtwAdapAndAdvIdentData}
									/>
									<Label for={props.id}>
										{m.backup_converter_add_empty_lines_between_adaptation_and_advanced_identification_data_label()}
									</Label>
								</div>
							{/snippet}
						</Form.Control>

						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Button class="w-full" disabled={!canSubmit}>
					<FileCogIcon aria-hidden="true" />{m.backup_converter_submit_label()}
				</Form.Button>
			</form>
			{#if showResult}
				<Separator />
				<div class="flex flex-col gap-2" id="backup-converter-result">
					<Label for="converted-backup">{m.backup_converter_result_label()}</Label>
					<div
						class="textarea-scrollbar relative rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30"
					>
						<Textarea
							id="converted-backup"
							readonly
							value={backupConverterResult}
							class="max-h-96 min-h-32 rounded-b-none border-none break-all focus-visible:ring-0 aria-invalid:ring-0"
						/>
						<div
							class="flex flex-wrap items-center justify-center gap-2 border-t bg-transparent p-1 sm:justify-between dark:bg-input/30"
						>
							<p class="ml-1.5 text-sm text-muted-foreground">
								{toHumanReadable(backupConverterResult?.length ?? 0)} character(s)
							</p>
							<div class="flex flex-wrap justify-center gap-2">
								<CopyButton
									copyFn={handleCopyConvertedBackup}
									text={m.backup_converter_copy_result_label()}
								/>
								<Button onclick={handleClickDownloadResult}>
									<FileDownIcon aria-hidden="true" />
									{m.backup_converter_download_result_label()}
								</Button>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/snippet}
</ContentWindow>
