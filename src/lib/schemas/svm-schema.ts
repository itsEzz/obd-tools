import { z } from 'zod';
import { m } from '$lib/paraglide/messages.js';

export const svmSchema = z.object({
	key: z
		.string(m.schema_string_invalid())
		.regex(/^[0-9A-F]{4}$|^[0-9]{5}$/i, m.svm_schema_key_invalid())
		.default('')
});

export type SvmSchema = z.infer<typeof svmSchema>;
