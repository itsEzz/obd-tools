import { building } from '$app/environment';
import * as privateEnv from '$env/dynamic/private';
import { serverEnvSchema, type ServerEnv } from '$lib/schemas/env';
import { emptyStringsToUndefined } from '$lib/utils/env';

export const serverEnv: ServerEnv = serverEnvSchema.parse(
	// During build time, provide dummy values for required env vars to satisfy the schema
	// At runtime, the real env vars will be used
	building ? {} : emptyStringsToUndefined(privateEnv.env)
);
