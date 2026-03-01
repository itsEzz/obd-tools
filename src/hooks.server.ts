import { paraglideMiddleware } from '$lib/paraglide/server';
import { validateEnv } from '$lib/server/env-validation';
import { getLogger } from '$lib/server/logger';
import type { Handle, ServerInit } from '@sveltejs/kit';

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

export const handle: Handle = paraglideHandle;

export const init: ServerInit = async () => {
	const logger = getLogger();

	try {
		logger.info('App initializing...');
		await validateEnv();
		logger.info('App initialization complete');
	} catch (error) {
		logger.error(error, 'App initialization failed');
		throw error;
	}
};
