import { z } from 'zod';
import { m } from '$lib/paraglide/messages.js';

export const svmSchema = z.object({
	value: z
		.string(m.schema_string_invalid())
		.regex(/^[0-9A-Fa-f]{4}$|^[0-9]{5}$/, m.svm_schema_key_invalid())
});

export const svmSchemaWithDefault = svmSchema.extend({
	value: svmSchema.shape.value.default('')
});
