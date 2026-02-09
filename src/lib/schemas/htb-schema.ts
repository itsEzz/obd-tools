import { m } from '$lib/paraglide/messages';
import z from 'zod';

export const htbSchema = z.object({
	value: z
		.string(m.schema_mustBeString())
		.regex(/^(?:[0-9A-F]{2})+$/i, m.schema_mustBeEvenHexadecimal())
});

export type HtbSchema = z.infer<typeof htbSchema>;
