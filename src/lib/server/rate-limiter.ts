import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
import { serverEnv } from './env';

export const rateLimiter = new RetryAfterRateLimiter({
	IP: serverEnv.RATE_LIMITER_IP,
	IPUA: serverEnv.RATE_LIMITER_IPUA
});
