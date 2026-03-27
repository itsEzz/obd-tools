import type { BackupConverterFormSchema } from '$lib/schemas/backup-converter';

export interface BackupLine {
	indentation: number;
	line: string;
}

export interface BackupBySection {
	section: string;
	data: BackupLine[];
}

export enum BackupNextLineLevelDetail {
	INVALID = -1,
	EQ = 0,
	LE = 1,
	GR = 2,
	END = 3
}

export type BackupConverterOptions = Omit<BackupConverterFormSchema, 'backup'>;

export interface BackupFormatValue {
	label: string;
	value: string;
}
