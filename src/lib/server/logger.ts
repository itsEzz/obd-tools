import { building } from '$app/environment';
import { join } from 'path';
import pino from 'pino';

const pinoTransport = pino.transport({
	targets: [
		{
			target: 'pino-roll',
			options: {
				file: join('logs', 'log'),
				frequency: 'daily',
				size: '10m',
				mkdir: true,
				limit: { count: 30 },
				dateFormat: 'yyyy-MM-dd'
			}
		},
		{
			target: 'pino-pretty',
			options: {
				colorize: true
			}
		}
	]
});

function createLogger(): pino.Logger {
	if (building) return pino({ enabled: false });

	return pino(pinoTransport);
}

let loggerInstance: pino.Logger | null = null;

export function getLogger(): pino.Logger {
	if (!loggerInstance) loggerInstance = createLogger();
	return loggerInstance;
}

export function createChildLogger(context: string): pino.Logger {
	const logger = getLogger();
	return logger.child({ ctx: context });
}
