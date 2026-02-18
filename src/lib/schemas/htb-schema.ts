import { m } from '$lib/paraglide/messages';
import z from 'zod';

export const htbSchema = z.object({
	value: z.string(m.schema_string_invalid()).regex(/^(?:[0-9A-Fa-f]{2})+$/, m.schema_hex_invalid())
});

export type HtbSchema = z.infer<typeof htbSchema>;
