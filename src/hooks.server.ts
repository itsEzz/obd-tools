import { paraglideMiddleware } from '$lib/paraglide/server';
import { validateEnv } from '$lib/server/env-validation';
import { getLogger } from '$lib/server/logger';
import { rateLimiter } from '$lib/server/rate-limiter';
import type { Handle, ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

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

const rateLimiterHandle: Handle = async ({ event, resolve }) => {
	// Only apply rate limiting to API routes
	if (!event.url.pathname.startsWith('/api/')) return resolve(event);

	const status = await rateLimiter.check(event);
	if (status.limited) {
		const response = new Response(
			`You are being rate limited. Please try again after ${status.retryAfter} seconds.`,
			{
				status: 429,
				headers: { 'Retry-After': status.retryAfter.toString() }
			}
		);
		return response;
	}
	const response = await resolve(event);
	return response;
};

export const handle: Handle = sequence(rateLimiterHandle, paraglideHandle);

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
