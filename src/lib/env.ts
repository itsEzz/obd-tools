import * as publicEnv from '$app/env/public';
import { clientEnvSchema, type ClientEnv } from '#lib/schemas/env.js';
import { emptyStringsToUndefined } from './utils/env';

export const clientEnv: ClientEnv = clientEnvSchema.parse(emptyStringsToUndefined(publicEnv));
