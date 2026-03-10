export interface HexToBinaryResult {
	byteNo: string;
	hex: string;
	binary: string;
	bits: {
		0: boolean;
		1: boolean;
		2: boolean;
		3: boolean;
		4: boolean;
		5: boolean;
		6: boolean;
		7: boolean;
	};
}
