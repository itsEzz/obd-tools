import { m } from '#lib/paraglide/messages.js';
import z from 'zod';

const codeElementSchema = z
	.string(m.schema_string_invalid())
	.regex(/^[0-9A-Za-z#]{3}$/, m.pr_codes_schema_prcode_invalid());

export const prCodesApiSchema = z.object({
	codes: z
		.array(codeElementSchema, m.schema_array_invalid())
		.min(1, m.pr_codes_schema_array_empty()),
	onlyFoundCodes: z.boolean(m.schema_boolean_invalid()).optional().default(true)
});

export const prCodesFormInputSchema = z.object({
	codes: z
		.string(m.schema_string_invalid())
		.regex(/^[0-9A-Za-z#]{3}(?:\s+[0-9A-Za-z#]{3})*$/, m.pr_codes_schema_input_invalid())
		.default(''),
	onlyFoundCodes: prCodesApiSchema.shape.onlyFoundCodes
});

export const prCodesFormOutputSchema = prCodesFormInputSchema.extend({
	codes: prCodesFormInputSchema.shape.codes
		.transform((str) => str.split(/\s+/))
		.pipe(z.array(codeElementSchema).min(1, m.pr_codes_schema_array_empty()))
});

export const prCodesParamsSchema = z.object({
	codes: z.string().default(''),
	onlyFoundCodes: z.boolean().default(true)
});

const prCodesResultSchema = z.array(
	z.object({
		code: z.string(),
		codeGroup: z.string(),
		description: z.string()
	})
);

export type PrCodesResult = z.infer<typeof prCodesResultSchema>;

export const prCodesApiResponseSchema = z.object({
	result: prCodesResultSchema
});

export type PrCodesApiResponse = z.infer<typeof prCodesApiResponseSchema>;
