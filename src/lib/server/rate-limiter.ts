import { RATE_LIMITER_IP, RATE_LIMITER_IPUA } from '$app/env/private';
import { tc } from '@itsezz/try-catch';
import { RetryAfterRateLimiter, type Rate } from 'sveltekit-rate-limiter/server';

function parseRate(raw: string | undefined, fallback: Rate | Rate[]): Rate | Rate[] {
	if (!raw) return fallback;
	const result = tc(() => JSON.parse(raw));
	if (result.ok) return result.data;
	else return fallback;
}

export const rateLimiter = new RetryAfterRateLimiter({
	IP: parseRate(RATE_LIMITER_IP, [3, '5m']),
	IPUA: parseRate(RATE_LIMITER_IPUA, [2, '5m'])
});
