import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';
import { resolve } from 'path';
import { readdirSync } from 'fs';

export default {
	name: 'help',
	type: 'user',
	description: 'Displays all the commands present',
	usage: '!help',

	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let userHelp = '\n\n[*User Commands*]\n\n';
			let adminHelp = '[*Admin Commands*]\n\n';
			let allFiles = readdirSync(resolve(__dirname, '../commands'));

			for (const file of allFiles) {
				let importedData = (await import(`./${file}`)).default;
				
				if (importedData.type === 'admin') {
					adminHelp += `➡ *${importedData.name}*\t[${importedData.description}]\n\tUsage: ${importedData.usage}\n\n`;
				} else if (importedData.type === 'user') {
					userHelp += `➡ *${importedData.name}*\t[${importedData.description}]\n\tUsage: ${importedData.usage}\n\n`;
				}
			}

			client.sendMessage(message.from, adminHelp + userHelp);
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