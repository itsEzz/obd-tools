import { failure, tc, tca, type Result } from '@itsezz/try-catch';

export function trackEvent(eventName: string): Promise<Result<void, unknown>>;
export function trackEvent(
	eventName: string,
	eventData: umami.EventData
): Promise<Result<void, unknown>>;
export function trackEvent(
	callback: (props: umami.PageViewProperties) => umami.CustomPayload
): Promise<Result<void, unknown>>;
export async function trackEvent(
	input: string | ((props: umami.PageViewProperties) => umami.CustomPayload),
	eventData?: umami.EventData
): Promise<Result<void, unknown>> {
	const trackFnResult = tc(() => umami.track.bind(umami));
	if (!trackFnResult.ok) return failure(new Error('Umami tracking function is not available'));

	if (typeof input === 'string') {
		if (eventData) return await tca(trackFnResult.data(input, eventData));
		else return await tca(trackFnResult.data(input));
	}

	if (typeof input === 'function') {
		return await tca(trackFnResult.data((props) => input(props)));
	}

	return failure(new Error('Invalid input type for trackEvent'));
}
