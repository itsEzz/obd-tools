import { m } from '$lib/paraglide/messages';
import z from 'zod';

export const ccSchema = z
	.object({
		value1: z
			.string(m.schema_mustBeString())
			.regex(/^(?:[0-9A-F]{2})+$/i, m.schema_mustBeEvenHexadecimal()),
		value2: z
			.string(m.schema_mustBeString())
			.regex(/^(?:[0-9A-F]{2})+$/i, m.schema_mustBeEvenHexadecimal())
	})
	.check((ctx) => {
		if (ctx.value.value1.length !== ctx.value.value2.length) {
			ctx.issues.push({
				code: 'custom',
				message: m.cc_schema_mustBeSameLength(),
				input: ctx.value.value1,
				path: ['value1', 'value2']
			});
		}
	});

export type CcSchema = z.infer<typeof ccSchema>;
