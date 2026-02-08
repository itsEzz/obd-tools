import { z } from 'zod';
import { m } from '$lib/paraglide/messages.js';

export const svmSchema = z.object({
	key: z
		.string(m.svm_schema_mustBeString())
		.regex(/^[0-9a-f]{4}$|^[0-9]{5}$/i, m.svm_schema_mustBeHexOrDecimal())
});
