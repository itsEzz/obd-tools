import { browser, version } from '$app/env';
import {
	PUBLIC_UMAMI_DO_NOT_TRACK,
	PUBLIC_UMAMI_HOST_URL,
	PUBLIC_UMAMI_WEBSITE_ID
} from '$app/env/public';
import { failure, success, tca, type Result } from '@itsezz/try-catch';

interface UmamiOptions {
	hostname: string;
	websiteId?: string;
	userAgent: string;
}

class Umami {
	private options: UmamiOptions;
	private doNotTrack: boolean;

	constructor(options?: Partial<UmamiOptions>) {
		const websiteId = options?.websiteId || PUBLIC_UMAMI_WEBSITE_ID;

		this.options = {
			hostname: options?.hostname || PUBLIC_UMAMI_HOST_URL || 'https://cloud.umami.is',
			websiteId,
			userAgent: options?.userAgent || `Mozilla/5.0 Umami/${version}`
		};

		this.doNotTrack =
			PUBLIC_UMAMI_DO_NOT_TRACK === 'true' && browser
				? 'globalPrivacyControl' in navigator
					? navigator.globalPrivacyControl === true
					: navigator.doNotTrack === '1'
				: false;
	}

	private async send(
		payload: Record<string, unknown>,
		type: 'event' | 'identify' = 'event'
	): Promise<Result<Response | null, unknown>> {
		if (this.doNotTrack || !this.options.websiteId) return success(null);

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

		return fetchResult;
	}

	async track(
		event: string | Record<string, unknown>,
		eventData?: Record<string, unknown>
	): Promise<Result<Response | null, unknown>> {
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
				return failure('Invalid event.');
		}
	}
}

export const umami = new Umami();
