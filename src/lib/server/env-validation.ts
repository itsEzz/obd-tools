import * as privateEnv from '$env/dynamic/private';
import { serverEnvSchema } from '$lib/schemas/env-schema';
import { emptyStringsToUndefined, formatValidationError } from '$lib/utils/env';
import { isError, tc } from '@itsezz/try-catch';
import { z } from 'zod/v4';
import { createChildLogger } from './logger';

export async function validateEnv() {
	const logger = createChildLogger('env-validation');

	logger.info('Validating environment variables...');

	const result = tc(() => serverEnvSchema.parse(emptyStringsToUndefined(privateEnv.env)));

	if (isError(result)) {
		if (result.error instanceof z.ZodError) {
			logger.error(result.error, formatValidationError(result.error));
			process.exit(1);
		}

		logger.error(
			`Environment Validation Error: ${result.error instanceof Error ? result.error.message : String(result.error)}`
		);

		process.exit(1);
	}

	logger.info('Environment variables are valid');
}
