import { m } from '$lib/paraglide/messages';
import z from 'zod';

export const hexToBinaryApiSchema = z.object({
	value: z.string(m.schema_string_invalid()).regex(/^(?:[0-9A-Fa-f]{2})+$/, m.schema_hex_invalid()),
	onlySetBytes: z.boolean(m.schema_boolean_invalid()).optional().default(false)
});

export const hexToBinaryFormSchema = hexToBinaryApiSchema.extend({
	value: hexToBinaryApiSchema.shape.value.default('')
});

export const hexToBinaryParamsSchema = z.object({
	value: z.string().default(''),
	onlySetBytes: z.boolean().default(false)
});

const hexToBinaryResultSchema = z.array(
	z.object({
		byteNo: z.string(),
		hex: z.string(),
		binary: z.string(),
		bits: z.object({
			0: z.boolean(),
			1: z.boolean(),
			2: z.boolean(),
			3: z.boolean(),
			4: z.boolean(),
			5: z.boolean(),
			6: z.boolean(),
			7: z.boolean()
		})
	})
);

export type HexToBinaryResult = z.infer<typeof hexToBinaryResultSchema>;

export const hexToBinaryApiResponseSchema = z.object({
	result: hexToBinaryResultSchema
});

export type HexToBinaryApiResponse = z.infer<typeof hexToBinaryApiResponseSchema>;
