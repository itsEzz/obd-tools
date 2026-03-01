import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
import { serverAppConfig } from './server-app-config';

export const rateLimiter = new RetryAfterRateLimiter({
	IP: serverAppConfig.RATE_LIMITER_IP,
	IPUA: serverAppConfig.RATE_LIMITER_IPUA
});
