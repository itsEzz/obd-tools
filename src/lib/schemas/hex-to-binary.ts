import { m } from '$lib/paraglide/messages';
import z from 'zod';

export const hexToBinaryApiSchema = z.object({
	value: z.string(m.schema_string_invalid()).regex(/^(?:[0-9A-Fa-f]{2})+$/, m.schema_hex_invalid())
});

export const hexToBinaryFormSchema = z.object({
	value: hexToBinaryApiSchema.shape.value.default('')
});

export const hexToBinaryParamsSchema = z.object({ value: z.string().default('') });
