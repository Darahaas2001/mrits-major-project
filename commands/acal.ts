import WAWebJS, { MessageMedia } from 'whatsapp-web.js';
import { resolve } from 'path';
import { fail } from '../utils/chalk';
import { db } from '../utils/db';
import { student } from '../Models/models';
import { collection } from '../utils/collection';

export default {
	name: 'acal',
	type: 'user',
	description: 'sends the academic calendar to the user',
	usage:
		'!acal or !acal <@mention> or !acal <year>\n\t Ex: !acal 3 or !acal @mandeep',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let userData;
			let taggedUser = await message.getMentions();
			if (args.length === 1 && taggedUser.length === 1) {
				userData = await db
					.collection<student>(collection.student)
					.findOne({ mobileNo: taggedUser[0]['number'] });
				// userData = await User.findOne({
				// 	mobileNo: taggedUser[0]['number'],
				// });
			} else if (
				args.length === 1 &&
				taggedUser.length === 0 &&
				!parseInt(args[0])
			) {
				userData = await db
					.collection<student>(collection.student)
					.findOne({ rollNo: args[0] });
				// userData = await User.findOne({ rollNo: args[0] });
			} else if (args.length === 0 && taggedUser.length === 0) {
				userData = await db
					.collection<student>(collection.student)
					.findOne({ mobileNo: (message.author as string).split('@')[0] });
				// userData = await User.findOne({
				// 	mobileNo: (message.author as string).split('@')[0],
				// });
			} else if (parseInt(args[0])) {
				userData = {
					yearOfStudy: args[0],
				};
			}

			let acal = MessageMedia.fromFilePath(
				resolve(
					__dirname,
					'../Assets/academic-calendar',

					`${userData?.yearOfStudy}`,

					'academic-calendar.png'
				)
			);
			client.sendMessage(message.from, acal);
		} catch (err) {
			client.sendMessage(message.from, `${err}`);
			fail(err);
			client.sendMessage(
				message.from,
				'Error occured, please contact developer'
			);
		}
	},
};
