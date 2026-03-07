export interface CodingCompareResult {
	byteNo: string;
	differs: boolean;
	hex1: string;
	hex2: string;
	bits1: {
		0: { set: boolean; differs: boolean };
		1: { set: boolean; differs: boolean };
		2: { set: boolean; differs: boolean };
		3: { set: boolean; differs: boolean };
		4: { set: boolean; differs: boolean };
		5: { set: boolean; differs: boolean };
		6: { set: boolean; differs: boolean };
		7: { set: boolean; differs: boolean };
	};
	bits2: {
		0: { set: boolean; differs: boolean };
		1: { set: boolean; differs: boolean };
		2: { set: boolean; differs: boolean };
		3: { set: boolean; differs: boolean };
		4: { set: boolean; differs: boolean };
		5: { set: boolean; differs: boolean };
		6: { set: boolean; differs: boolean };
		7: { set: boolean; differs: boolean };
	};
}
