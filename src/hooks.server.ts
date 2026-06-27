import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import type { TooManyRequestsResponse } from '$lib/schemas/api';
import { rateLimiter } from '$lib/server/rate-limiter';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleRateLimiter: Handle = async ({ event, resolve }) => {
	// Only apply rate limiting to API routes
	if (!event.url.pathname.startsWith('/api/')) return resolve(event);

	const status = await rateLimiter.check(event);
	if (status.limited) {
		const response = new Response(
			`You are being rate limited. Please try again after ${status.retryAfter} seconds.` satisfies TooManyRequestsResponse,
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

export const handle: Handle = sequence(handleParaglide, handleRateLimiter);
