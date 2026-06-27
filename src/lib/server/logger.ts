import { building, dev } from '$app/environment';
import { join } from 'node:path';
import pino, { type Logger, type TransportTargetOptions } from 'pino';

function createTransport() {
	const targets: TransportTargetOptions[] = [
		{
			target: 'pino-roll',
			level: 'info',
			options: {
				file: join('logs', 'app'),
				frequency: 'daily',
				size: '10m',
				mkdir: true,
				limit: { count: 30 },
				dateFormat: 'yyyy-MM-dd'
			}
		}
	];

	if (dev) {
		targets.push({
			target: 'pino-pretty',
			level: 'debug',
			options: {
				colorize: true,
				translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
				ignore: 'pid,hostname'
			}
		});
	}

	return pino.transport({ targets });
}

function createLogger(): Logger {
	if (building) {
		return pino({ enabled: false });
	}

	return pino(
		{
			level: dev ? 'debug' : 'info'
		},
		createTransport()
	);
}

let loggerInstance: Logger | undefined;

export function getLogger(): Logger {
	if (!loggerInstance) loggerInstance = createLogger();
	return loggerInstance;
}

export function createChildLogger(context: string): Logger {
	return getLogger().child({ ctx: context });
}
