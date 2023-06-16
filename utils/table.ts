import { TableUserConfig, table } from 'table';

export const tableData = (
	data: string[][] | number[][],
	config: TableUserConfig
) => {
	return table(data, config);
};
