import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';
import { tableConfig, tableData } from '../utils/table';
import { TableUserConfig } from 'table';

export default {
	name: 'material',
	type: 'user',
	description: 'Study material for the students',
	usage: '!material\n\t1.Enter the appropriate selection number to select the branch.\n\t2. In the next step, material link is provided.',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let usrObj: any = { author: message.author };
			let data = [
				['1', 'CSE'],
				['2', 'IT'],
				['3', 'ECE'],
			];
			let config: TableUserConfig = {
				...tableConfig,
				header: {
					content: '*Please select the branch*\n',
					wrapWord: true,
					alignment: 'left',
				},
			};
			let msg = tableData(data, config);

			client.sendMessage(message.from, msg);

			const messageHandler = (message: WAWebJS.Message) => {
				let usrData = { ...usrObj };

				if (message.author === usrData.author) {
					switch (message.body) {
						case '1':
							client.sendMessage(
								message.from,
								'https://drive.google.com/drive/folders/1EslwKZP1uL_OruoBGkH3eSCiCmJ_b9qy?usp=sharing'
							);
							break;
						case '2':
							client.sendMessage(
								message.from as string,
								'https://drive.google.com/drive/folders/1jg-n3y6vL8YvSoRt_MDJmZIpBK0W77SP?usp=sharing'
							);
							break;
						case '3':
							client.sendMessage(
								message.from as string,
								'https://drive.google.com/drive/folders/1VkpDuIDIiqcM63Usjtcv0EZGxHM9FrOT?usp=sharing'
							);

						default:
							break;
					}
					usrData = undefined;
					delete usrObj.author;
				}
			};

			client.on('message', messageHandler);
		} catch (err) {
			fail(err);
			client.sendMessage(message.from, `${err}`);
			client.sendMessage(
				message.from,
				'Error occured, please contact developer'
			);
		}
	},
};
