import { m } from '$lib/paraglide/messages';
import type { BackupFormatValue } from '$lib/types/backup-converter';
import z from 'zod';

export const backupFormatValues = ['compact', 'extended', 'full'] as const;
export const backupFormatSelectValues: BackupFormatValue[] = [
	{
		label: m.backup_converter_format_compact_label(),
		value: backupFormatValues[0]
	},
	{
		label: m.backup_converter_format_extended_label(),
		value: backupFormatValues[1]
	},
	{
		label: m.backup_converter_format_full_label(),
		value: backupFormatValues[2]
	}
];
export const maxFileSizeInBytes: { maxSize: number; readable: string } = {
	maxSize: 10 * 1024 * 1024,
	readable: '10MB'
};

const booleanSchema = z
	.enum(['true', 'True', 'false', 'False'] as const)
	.transform((val) => val.toLowerCase() === 'true');

export const backupConverterApiSchema = z.object({
	backup: z
		.file()
		.refine(
			(file) => file.type === 'text/plain' && file.name.endsWith('.txt'),
			m.backup_converter_schema_file_type_invalid()
		)
		.max(
			maxFileSizeInBytes.maxSize,
			m.backup_converter_schema_file_too_big({
				readable_file_size_limit: maxFileSizeInBytes.readable
			})
		)
		.transform(async (file) => await file.text()),
	delimiter: z
		.string(m.schema_string_invalid())
		.length(1, m.backup_converter_schema_delimiter_invalid())
		.default(';'),
	format: z
		.enum(
			backupFormatValues,
			m.backup_converter_schema_format_invalid({
				format1: backupFormatValues[0],
				format2: backupFormatValues[1],
				format3: backupFormatValues[2]
			})
		)
		.default('compact'),
	incBasicBkpInfo: booleanSchema.default(true),
	incBasicCUInfo: booleanSchema.default(true),
	incAdapData: booleanSchema.default(true),
	incAdvIdentData: booleanSchema.default(true),
	addEmptyLinesBtwCUs: booleanSchema.default(true),
	addEmptyLinesBtwAdapAndAdvIdentData: booleanSchema.default(true)
});

export const backupConverterFormSchema = z.object({
	backup: z
		.string(m.schema_string_invalid())
		.min(100, m.backup_converter_schema_backup_min_length({ minLength: 100 }))
		.max(500000, m.backup_converter_schema_backup_max_length({ maxLength: 500000 }))
		.default(''),
	delimiter: backupConverterApiSchema.shape.delimiter,
	format: backupConverterApiSchema.shape.format,
	incBasicBkpInfo: z.boolean(m.schema_boolean_invalid()).default(true),
	incBasicCUInfo: z.boolean(m.schema_boolean_invalid()).default(true),
	incAdapData: z.boolean(m.schema_boolean_invalid()).default(true),
	incAdvIdentData: z.boolean(m.schema_boolean_invalid()).default(true),
	addEmptyLinesBtwCUs: z.boolean(m.schema_boolean_invalid()).default(true),
	addEmptyLinesBtwAdapAndAdvIdentData: z.boolean(m.schema_boolean_invalid()).default(true)
});

export type BackupConverterFormSchema = z.infer<typeof backupConverterFormSchema>;

export const backupConverterParamsSchema = z.object({
	delimiter: z.string().default(';'),
	format: z.enum(backupFormatValues).default('compact'),
	incBasicBkpInfo: z.boolean(m.schema_boolean_invalid()).default(true),
	incBasicCUInfo: z.boolean(m.schema_boolean_invalid()).default(true),
	incAdapData: z.boolean(m.schema_boolean_invalid()).default(true),
	incAdvIdentData: z.boolean(m.schema_boolean_invalid()).default(true),
	addEmptyLinesBtwCUs: z.boolean(m.schema_boolean_invalid()).default(true),
	addEmptyLinesBtwAdapAndAdvIdentData: z.boolean(m.schema_boolean_invalid()).default(true)
});
