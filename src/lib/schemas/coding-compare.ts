import { m } from '$lib/paraglide/messages';
import z from 'zod';

const hexSchema = z
	.string(m.schema_string_invalid())
	.regex(/^(?:[0-9A-Fa-f]{2})+$/, m.schema_hex_invalid());

const codingCompareBaseSchema = z.object({
	value1: hexSchema,
	value2: hexSchema
});

export const codingCompareSchema = codingCompareBaseSchema.check((ctx) => {
	if (ctx.value.value1.length !== ctx.value.value2.length) {
		ctx.issues.push({
			code: 'custom',
			message: m.cc_schema_lengths_invalid(),
			input: ctx.value.value1,
			path: [ctx.value.value1.length < ctx.value.value2.length ? 'value1' : 'value2']
		});
	}
});

export const codingCompareSchemaWithDefault = codingCompareBaseSchema
	.extend({
		value1: codingCompareSchema.shape.value1.default(''),
		value2: codingCompareSchema.shape.value2.default('')
	})
	.check((ctx) => {
		if (ctx.value.value1.length !== ctx.value.value2.length) {
			ctx.issues.push({
				code: 'custom',
				message: m.cc_schema_lengths_invalid(),
				input: ctx.value.value1,
				path: ['value1']
			});
			ctx.issues.push({
				code: 'custom',
				message: m.cc_schema_lengths_invalid(),
				input: ctx.value.value1,
				path: ['value2']
			});
		}
	});
