import * as publicEnv from '$env/dynamic/public';
import { clientEnvSchema, type ClientEnv } from '$lib/schemas/env';
import { emptyStringsToUndefined } from './utils/env';

export const clientEnv: ClientEnv = clientEnvSchema.parse(emptyStringsToUndefined(publicEnv.env));
