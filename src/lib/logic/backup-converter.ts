import type {
	BackupConverterFormSchema,
	BackupConverterResult
} from '#lib/schemas/backup-converter.js';
import { umami } from '#lib/utils/umami.js';
import { failure, tc, type Result } from '@itsezz/try-catch';
import XRegExp from 'xregexp';

interface BackupLine {
	indentation: number;
	line: string;
}

interface BackupBySection {
	section: string;
	data: BackupLine[];
}

enum BackupNextLineLevelDetail {
	INVALID = -1,
	EQ = 0,
	LE = 1,
	GR = 2,
	END = 3
}

type BackupConverterOptions = Omit<BackupConverterFormSchema, 'backup'>;

const indentationRegex = new RegExp('^\\s*', 'i');
const controlUnitRegex = XRegExp(
	'^(?: {4}[\\pL\\pM\\s-]+:\\s|\\t{2})([A-F0-9]{2})\\s([\\pL\\pM\\s\\-0-9]{2,})$',
	'i'
);
const dashRegex = new RegExp('^-{6,}$', 'i');
const sectionRegex = new RegExp('^[A-F0-9]{2}\\s.+$', 'i');

export function convertOBDElevenBackup(
	data: BackupConverterFormSchema
): Result<BackupConverterResult, unknown> {
	const { backup, ...options } = data;

	const prepareResult = tc(() => prepareBackup(backup));

	if (!prepareResult.ok) return prepareResult;

	if (prepareResult.data.backupBySection.length < 2 || prepareResult.data.backupLevels.size < 2)
		return failure(new Error('Backup data seems invalid'));

	const levelResult = tc(() => getHighAndLowLevels(prepareResult.data.backupLevels));

	if (!levelResult.ok) return levelResult;

	const conversionResult = tc(() =>
		convertBackup(
			prepareResult.data.backupBySection,
			options,
			levelResult.data.highLevels,
			levelResult.data.lowLevels
		)
	);

	const result =
		conversionResult.ok && conversionResult.data.length > 100
			? conversionResult
			: failure(new Error('Converted backup size is too small'));

	void umami.track(result.ok ? 'bc-success' : 'bc-error', {
		input: { ...options, backupLength: backup.length },
		error: result.error ? JSON.stringify(result.error) : undefined
	});

	return result;
}

function prepareBackup(backup: string): {
	backupBySection: BackupBySection[];
	backupLevels: Map<number, number>;
} {
	const backupBySection: BackupBySection[] = [];
	let backupLevels: Map<number, number> = new Map();
	let currentSection: string | null = null;

	backup.split('\n').forEach((_line) => {
		const line = _line.replace('\r', '').replace('\n', '').replace(',', '');
		if (line.trim().length === 0 || dashRegex.test(line)) return;

		const level = line.match(indentationRegex);
		const controlUnit = line.match(controlUnitRegex);

		if (!currentSection && !controlUnit) currentSection = 'backupInfo';
		else if (controlUnit) currentSection = [controlUnit[1], controlUnit[2]].join(' ');

		if (!level) return;

		const indentation = level[0].length;

		const sectionIndex = backupBySection.findIndex((entry) => entry.section === currentSection);
		if (sectionIndex >= 0)
			backupBySection[sectionIndex].data.push({ line: line.trim(), indentation: indentation });
		else
			backupBySection.push({
				section: currentSection!,
				data: [{ line: line.trim(), indentation: indentation }]
			});

		if (!backupLevels.has(indentation)) backupLevels.set(indentation, 1);
		else backupLevels.set(indentation, backupLevels.get(indentation)! + 1);
	});

	backupLevels = new Map([...backupLevels.entries()].sort(([keyA], [keyB]) => keyA - keyB));

	return { backupBySection, backupLevels };
}

function getHighAndLowLevels(backupLevels: Map<number, number>): {
	highLevels: number[];
	lowLevels: number[];
} {
	const isOld = isOldBackup(backupLevels);
	const levelArray = Array.from(backupLevels.entries()).map(([level]) => level);
	if (isOld) {
		return {
			highLevels: levelArray.slice(-2),
			lowLevels: levelArray.slice(0, levelArray.length - 2)
		};
	} else {
		return {
			highLevels: levelArray.slice(-3),
			lowLevels: levelArray.slice(0, levelArray.length - 3)
		};
	}
}

function isOldBackup(backupLevels: Map<number, number>): boolean {
	return backupLevels.size === 3;
}

function convertBackup(
	backupBySection: BackupBySection[],
	options: BackupConverterOptions,
	highLevels: number[],
	lowLevels: number[]
): string {
	const convertedBackup: Array<string> = [];

	backupBySection.forEach(({ section, data }) => {
		const highLevelValues: Record<string, string | null> = {
			type: null,
			level0: null,
			level1: null,
			level2: null
		};

		if (!sectionRegex.test(section)) {
			convertedBackup.push(...convertBasicBackupInformation(data, options));
		} else {
			if (options.addEmptyLinesBtwCUs && convertedBackup.length > 0)
				convertedBackup.push(options.delimiter);

			convertedBackup.push(
				...convertControlUnitInformation(
					section,
					data,
					options,
					highLevels,
					lowLevels,
					highLevelValues
				)
			);
		}
	});

	return convertedBackup.join('\n');
}

function convertBasicBackupInformation(
	data: BackupLine[],
	options: BackupConverterOptions
): string[] {
	const convertedBackupPart: string[] = [];
	if (!options.incBasicBkpInfo) return [];
	data.forEach(({ line }) => {
		convertedBackupPart.push([options.delimiter, line].join(''));
	});

	return convertedBackupPart;
}

function convertControlUnitInformation(
	section: string,
	data: BackupLine[],
	options: BackupConverterOptions,
	highLevels: number[],
	lowLevels: number[],
	highLevelValues: Record<string, string | null>
): string[] {
	let skipNextLine: boolean = false;
	let abortCurrentIteration: boolean = false;
	const convertedBackupPart: string[] = [];

	data.forEach(({ line, indentation }, index) => {
		if (skipNextLine) {
			skipNextLine = false;
			return;
		}

		// Basic Control Unit Information
		// Control Unit Information
		if (
			lowLevels.includes(indentation) &&
			[BackupNextLineLevelDetail.EQ, BackupNextLineLevelDetail.END].includes(
				getNextLineLevelDetails(data, index)
			)
		) {
			if (!options.incBasicCUInfo && index > 0) return;
			convertedBackupPart.push([options.delimiter, line].join(''));
			return;
		}
		// Get long coding from next line and append to current line
		else if (
			lowLevels.includes(indentation) &&
			getNextLineLevelDetails(data, index) === BackupNextLineLevelDetail.GR &&
			getNextLineLevelDetails(data, index + 1) === BackupNextLineLevelDetail.LE
		) {
			if (line.endsWith(':')) {
				convertedBackupPart.push([options.delimiter, line, ' ', data[index + 1].line].join(''));
			} else {
				convertedBackupPart.push([options.delimiter, line + ': ', data[index + 1].line].join(''));
			}
			skipNextLine = true;
			return;
		}

		if (
			indentation === lowLevels[lowLevels.length - 1] &&
			getNextLineLevelDetails(data, index) === BackupNextLineLevelDetail.GR &&
			getNextLineLevelDetails(data, index + 1) === BackupNextLineLevelDetail.GR
		) {
			if (options.addEmptyLinesBtwAdapAndAdvIdentData) convertedBackupPart.push(options.delimiter);
			if (options.format === 'compact')
				convertedBackupPart.push([options.delimiter, line.replace(':', '')].join(''));
		}

		[highLevelValues, abortCurrentIteration] = setHighLevelValues(
			data,
			index,
			line,
			indentation,
			options,
			highLevels,
			lowLevels,
			highLevelValues
		);

		if (abortCurrentIteration) return;

		// Add line to converted backup if all levels are set
		if (Object.values(highLevelValues).every((value) => value !== null)) {
			convertedBackupPart.push(convertToSelectedFormat(section, options, highLevelValues));
			highLevelValues = {
				...highLevelValues,
				level2: null
			};
		}
	});

	return convertedBackupPart;
}

function convertToSelectedFormat(
	section: string,
	options: BackupConverterOptions,
	highLevelValues: Record<string, string | null>
): string {
	switch (options.format) {
		case 'compact':
			return [highLevelValues.level0, highLevelValues.level1, highLevelValues.level2].join(
				options.delimiter
			);
		case 'extended':
			return [
				highLevelValues.type,
				highLevelValues.level0,
				highLevelValues.level1,
				highLevelValues.level2
			].join(options.delimiter);
		case 'full':
			return [
				section.split(' ')[0],
				highLevelValues.type,
				highLevelValues.level0,
				highLevelValues.level1,
				highLevelValues.level2
			].join(options.delimiter);
		default:
			return [highLevelValues.level0, highLevelValues.level1, highLevelValues.level2].join(
				options.delimiter
			);
	}
}

function setHighLevelValues(
	data: BackupLine[],
	index: number,
	line: string,
	indentation: number,
	options: BackupConverterOptions,
	highLevels: number[],
	lowLevels: number[],
	highLevelValues: Record<string, string | null>
): [Record<string, string | null>, boolean] {
	// Get high type value
	if (
		indentation === lowLevels[lowLevels.length - 1] &&
		getNextLineLevelDetails(data, index) === BackupNextLineLevelDetail.GR &&
		getNextLineLevelDetails(data, index + 1) === BackupNextLineLevelDetail.GR
	) {
		if (!options.incAdapData && !options.incAdvIdentData) return [highLevelValues, true];
		else if (!options.incAdapData && !line.includes(' ')) {
			highLevelValues = {
				type: null,
				level0: null,
				level1: null,
				level2: null
			};
			return [highLevelValues, true];
		} else if (!options.incAdvIdentData && line.includes(' ')) {
			highLevelValues = {
				type: null,
				level0: null,
				level1: null,
				level2: null
			};
			return [highLevelValues, true];
		}
		highLevelValues = {
			type: line.replace(':', ''),
			level0: null,
			level1: null,
			level2: null
		};
		return [highLevelValues, true];
	}
	// Get high level 0 value
	else if (
		indentation === highLevels[0] &&
		getNextLineLevelDetails(data, index) === BackupNextLineLevelDetail.GR &&
		[BackupNextLineLevelDetail.EQ, BackupNextLineLevelDetail.GR].includes(
			getNextLineLevelDetails(data, index + 1)
		)
	) {
		return [
			{
				...highLevelValues,
				level0: line.replace(':', '')
			},

			true
		];
	}
	// Get high level 1 value
	else if (
		highLevelValues.level0 &&
		indentation === highLevels[1] &&
		[BackupNextLineLevelDetail.EQ, BackupNextLineLevelDetail.GR].includes(
			getNextLineLevelDetails(data, index)
		)
	) {
		return [
			{
				...highLevelValues,
				level1: line.replace(':', '')
			},

			true
		];
	}
	// Get high level 2 value
	else if (
		highLevelValues.level0 &&
		highLevelValues.level1 &&
		indentation === highLevels[2] &&
		getNextLineLevelDetails(data, index) === BackupNextLineLevelDetail.LE
	) {
		return [
			{
				...highLevelValues,
				level2: line.replace(':', '')
			},

			false
		];
	}

	return [highLevelValues, false];
}

function getNextLineLevelDetails(
	backupLines: BackupLine[],
	index: number
): BackupNextLineLevelDetail {
	if (index >= backupLines.length - 1) return BackupNextLineLevelDetail.END;
	if (index < 0) return BackupNextLineLevelDetail.INVALID;

	const currentLine = backupLines[index];
	const nextLine = backupLines[index + 1];

	if (nextLine.indentation > currentLine.indentation) return BackupNextLineLevelDetail.GR;
	else if (nextLine.indentation < currentLine.indentation) return BackupNextLineLevelDetail.LE;
	else if (nextLine.indentation === currentLine.indentation) return BackupNextLineLevelDetail.EQ;
	return BackupNextLineLevelDetail.INVALID;
}
