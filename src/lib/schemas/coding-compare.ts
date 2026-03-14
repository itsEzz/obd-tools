import { m } from '$lib/paraglide/messages';
import z from 'zod';

const hexSchema = z
	.string(m.schema_string_invalid())
	.regex(/^(?:[0-9A-Fa-f]{2})+$/, m.schema_hex_invalid());

const codingCompareBaseSchema = z.object({
	value1: hexSchema,
	value2: hexSchema,
	onlyDiff: z.boolean(m.schema_boolean_invalid()).default(false)
});

export const codingCompareApiSchema = codingCompareBaseSchema.check((ctx) => {
	if (ctx.value.value1.length !== ctx.value.value2.length) {
		ctx.issues.push({
			code: 'custom',
			message: m.coding_compare_schema_lengths_invalid(),
			input: ctx.value.value1,
			path: ['value1', 'value2']
		});
	}
});

export const codingCompareFormSchema = codingCompareBaseSchema
	.extend({
		value1: codingCompareApiSchema.shape.value1.default(''),
		value2: codingCompareApiSchema.shape.value2.default('')
	})
	.check((ctx) => {
		if (ctx.value.value1.length !== ctx.value.value2.length) {
			ctx.issues.push({
				code: 'custom',
				message: m.coding_compare_schema_lengths_invalid(),
				input: ctx.value.value1,
				path: [ctx.value.value1.length < ctx.value.value2.length ? 'value1' : 'value2']
			});
		}
	});

export const codingCompareParamsSchema = z.object({
	value1: z.string().default(''),
	value2: z.string().default(''),
	onlyDiff: z.boolean().default(false)
});
