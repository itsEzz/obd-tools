import { version } from '$app/environment';
import { clientAppConfig } from '$lib/utils/client-app-config';

interface UmamiOptions {
	hostname: string;
	websiteId: string;
	userAgent: string;
}

class Umami {
	private options: UmamiOptions;

	constructor(options?: Partial<UmamiOptions>) {
		const websiteId = options?.websiteId || clientAppConfig.PUBLIC_UMAMI_WEBSITE_ID;
		if (!websiteId) throw new Error('No website ID provided.');

		this.options = {
			hostname:
				options?.hostname || clientAppConfig.PUBLIC_UMAMI_HOST_URL || 'https://cloud.umami.is',
			websiteId: websiteId,
			userAgent: options?.userAgent || `Mozilla/5.0 Umami/${version}`
		};
	}

	send(payload: Record<string, unknown>, type: 'event' | 'identify' = 'event'): Promise<Response> {
		const { hostname, userAgent } = this.options;

		return fetch(`${hostname}/api/send`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': userAgent
			},
			body: JSON.stringify({ type, payload })
		});
	}

	track(
		event: string | Record<string, unknown>,
		eventData?: Record<string, unknown>
	): Promise<Response> {
		const type = typeof event;
		const { websiteId } = this.options;
		switch (type) {
			case 'string':
				return this.send({
					website: websiteId,
					name: event,
					data: eventData
				});
			case 'object':
				return this.send({ website: websiteId, ...(event as Record<string, unknown>) });
			default:
				return Promise.reject('Invalid event.');
		}
	}
}

export const umami = new Umami();
