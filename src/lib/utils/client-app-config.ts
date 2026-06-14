import * as publicEnv from '$env/dynamic/public';
import { clientEnvSchema, type ClientEnv } from '$lib/schemas/env';
import { emptyStringsToUndefined } from './env';

const result = clientEnvSchema.safeParse(emptyStringsToUndefined(publicEnv.env));

if (!result.success) {
	throw new Error(
		'Invalid client environment variables. Restart the server and check the console for more details.'
	);
}

export const clientAppConfig: ClientEnv = result.data;
