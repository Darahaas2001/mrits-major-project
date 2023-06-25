import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';

export default {
	name: 'about',
	type: 'user',
	description: 'About this application',
	usage: '!about',
	exec: (client: WAWebJS.Client, message: WAWebJS.Message, args: string[]) => {
		try {
			let startTime = process.hrtime();
			let aboutData = `*Designed for MRITS* \n A.Mandeep \n N.Darahaas \n\n Made with ❤️ using TS`;
			let endTime = process.hrtime(startTime);
			// let listData = new Buttons("This is body", [{body:"button1"},{body:"button2"}], null, null)
			// client.sendMessage(message.from, listData)
			message.reply(
				aboutData + `\ntook ${endTime[1]} nano-seconds`,
				message.from
			);
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
