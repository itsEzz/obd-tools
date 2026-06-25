import { version } from '$app/environment';
import { clientEnv } from '$lib/env';
import { tca } from '@itsezz/try-catch';

interface UmamiOptions {
	hostname: string;
	websiteId: string;
	userAgent: string;
}

class Umami {
	private options: UmamiOptions;
	private doNotTrack: boolean;

	constructor(options?: Partial<UmamiOptions>) {
		const websiteId = options?.websiteId || clientEnv.PUBLIC_UMAMI_WEBSITE_ID;
		if (!websiteId) throw new Error('No website ID provided.');

		this.options = {
			hostname: options?.hostname || clientEnv.PUBLIC_UMAMI_HOST_URL || 'https://cloud.umami.is',
			websiteId: websiteId,
			userAgent: options?.userAgent || `Mozilla/5.0 Umami/${version}`
		};

		this.doNotTrack =
			clientEnv.PUBLIC_UMAMI_DO_NOT_TRACK === 'true'
				? 'globalPrivacyControl' in navigator
					? navigator.globalPrivacyControl === true
					: navigator.doNotTrack === '1'
				: false;
	}

	private async send(
		payload: Record<string, unknown>,
		type: 'event' | 'identify' = 'event'
	): Promise<Response | null> {
		if (this.doNotTrack) return Promise.resolve(null);

		const { hostname, userAgent } = this.options;

		const fetchResult = await tca(
			fetch(`${hostname}/api/send`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': userAgent
				},
				body: JSON.stringify({ type, payload })
			})
		);

		if (fetchResult.ok && fetchResult.data.ok) return fetchResult.data;
		return null;
	}

	async track(
		event: string | Record<string, unknown>,
		eventData?: Record<string, unknown>
	): Promise<Response | null> {
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
