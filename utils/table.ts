import { TableUserConfig, table } from 'table';

export const tableData = (
	data: string[][] | number[][],
	config: TableUserConfig
) => {
	return table(data, config);
};

export const tableConfig: TableUserConfig = {
	drawVerticalLine: (lineIndex, columnCount) => {
		return lineIndex === 1;
	},
	drawHorizontalLine: () => {
		return false;
	},
	columnDefault: {
		width: 30,
		paddingLeft: 1,
		paddingRight: 5,
	},
	columns: [{ width: 1, paddingLeft: 1, paddingRight: 2 }],
};
