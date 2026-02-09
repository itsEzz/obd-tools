import { m } from '$lib/paraglide/messages';
import z from 'zod';

export const bcFormatValues = ['compact', 'extended', 'full'] as const;

export const bcSchema = z.object({
	backup: z
		.string(m.schema_mustBeString())
		.min(400, m.bc_schema_backupMinLength({ minLength: 400 }))
		.max(500000, m.bc_schema_backupMaxLength({ maxLength: 500000 })),
	delimiter: z
		.string(m.schema_mustBeString())
		.length(1, m.bc_schema_delimiterMustBeOneCharacter())
		.default(';'),
	format: z
		.enum(
			bcFormatValues,
			m.bc_schema_formatMustBeValid({
				format1: bcFormatValues[0],
				format2: bcFormatValues[1],
				format3: bcFormatValues[2]
			})
		)
		.default('compact'),
	includeBasicBackupInformation: z.boolean(m.schema_mustBeBoolean()).default(true),
	includeBasicControlUnitInformation: z.boolean(m.schema_mustBeBoolean()).default(true),
	includeAdaptationData: z.boolean(m.schema_mustBeBoolean()).default(true),
	includeAdvancedIdentificationData: z.boolean(m.schema_mustBeBoolean()).default(true),
	addEmptyLinesBetweenControlUnits: z.boolean(m.schema_mustBeBoolean()).default(true),
	addEmptyLinesBetweenAdaptationAndAdvancedIdentificationData: z
		.boolean(m.schema_mustBeBoolean())
		.default(true)
});

export type BcSchema = z.infer<typeof bcSchema>;
