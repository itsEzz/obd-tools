import { m } from '$lib/paraglide/messages.js';
import { z } from 'zod';

export const svmApiSchema = z.object({
	value: z
		.string(m.schema_string_invalid())
		.regex(/^[0-9A-Fa-f]{4}$|^[0-9]{5}$/, m.svm_schema_key_invalid())
});

export const svmFormSchema = svmApiSchema.extend({
	value: svmApiSchema.shape.value.default('')
});

export const svmParamsSchema = z.object({ value: z.string().default('') });
