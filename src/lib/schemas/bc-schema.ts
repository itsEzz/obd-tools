import { m } from '$lib/paraglide/messages';
import z from 'zod';

export const bcFormatValues = ['compact', 'extended', 'full'] as const;

export const bcSchema = z.object({
	backup: z
		.string(m.schema_string_invalid())
		.min(400, m.bc_schema_backup_min_length({ minLength: 400 }))
		.max(500000, m.bc_schema_backup_max_length({ maxLength: 500000 })),
	delimiter: z
		.string(m.schema_string_invalid())
		.length(1, m.bc_schema_delimiter_invalid())
		.default(';'),
	format: z
		.enum(
			bcFormatValues,
			m.bc_schema_format_invalid({
				format1: bcFormatValues[0],
				format2: bcFormatValues[1],
				format3: bcFormatValues[2]
			})
		)
		.default('compact'),
	includeBasicBackupInformation: z.boolean(m.schema_boolean_invalid()).default(true),
	includeBasicControlUnitInformation: z.boolean(m.schema_boolean_invalid()).default(true),
	includeAdaptationData: z.boolean(m.schema_boolean_invalid()).default(true),
	includeAdvancedIdentificationData: z.boolean(m.schema_boolean_invalid()).default(true),
	addEmptyLinesBetweenControlUnits: z.boolean(m.schema_boolean_invalid()).default(true),
	addEmptyLinesBetweenAdaptationAndAdvancedIdentificationData: z
		.boolean(m.schema_boolean_invalid())
		.default(true)
});

export type BcSchema = z.infer<typeof bcSchema>;
