import { m } from '$lib/paraglide/messages';
import z from 'zod';

export const prlSchema = z.object({
	prCodes: z
		.array(
			z.string(m.schema_string_invalid()).regex(/^[0-9A-Za-z#]{3}$/, m.prl_schema_prcode_invalid())
		)
		.min(1, m.prl_schema_array_empty())
});

export type PrlSchema = z.infer<typeof prlSchema>;
