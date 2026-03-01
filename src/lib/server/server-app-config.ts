import { building } from '$app/environment';
import * as privateEnv from '$env/dynamic/private';
import { serverEnvSchema, type ServerEnv } from '$lib/schemas/env-schema';
import { emptyStringsToUndefined } from '$lib/utils/env';

const result = serverEnvSchema.safeParse(
	// During build time, provide dummy values for required env vars to satisfy the schema
	// At runtime, the real env vars will be used
	building ? {} : emptyStringsToUndefined(privateEnv.env)
);

if (!result.success) {
	throw new Error(
		'Invalid server environment variables. Restart the server and check the console for more details.'
	);
}

export const serverAppConfig: ServerEnv = result.data;
