import { getTextDirection } from '#lib/paraglide/runtime.js';
import { paraglideMiddleware } from '#lib/paraglide/server.js';
import type { TooManyRequestsResponse } from '#lib/schemas/api.js';
import { rateLimiter } from '#lib/server/rate-limiter.js';
import { sequence, type Handle } from '@sveltejs/kit/hooks';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		return resolve(
			{ ...event, request: localizedRequest },
			{
				transformPageChunk: ({ html }) => {
					return html.replace('%lang%', locale).replace('%dir%', getTextDirection(locale));
				}
			}
		);
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
