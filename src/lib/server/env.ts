import { building } from '$app/env';
import * as privateEnv from '$app/env/private';
import { serverEnvSchema, type ServerEnv } from '#lib/schemas/env.js';
import { emptyStringsToUndefined } from '#lib/utils/env.js';

export const serverEnv: ServerEnv = serverEnvSchema.parse(
	// During build time, provide dummy values for required env vars to satisfy the schema
	// At runtime, the real env vars will be used
	building ? {} : emptyStringsToUndefined(privateEnv)
);
