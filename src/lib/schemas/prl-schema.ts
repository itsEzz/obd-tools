import { m } from '$lib/paraglide/messages';
import z from 'zod';

export const prlSchema = z.object({
	prCodes: z
		.array(
			z
				.string(m.schema_mustBeString())
				.regex(/^([0-9A-Z#]{3}\\s)*[0-9A-Z#]{3}$/i, m.prl_schema_mustBeValidPrcode())
		)
		.min(1, m.prl_schema_mustBeNonEmptyArray())
});

export type PrlSchema = z.infer<typeof prlSchema>;
