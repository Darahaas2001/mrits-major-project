import WAWebJS, { MessageMedia } from 'whatsapp-web.js';
import { resolve } from 'path';
import { fail } from '../utils/chalk';
import { db } from '../utils/db';
import { student } from '../Models/models';
import { collection } from '../utils/collection';
export default {
	name: 'timetable',
	type: 'user',
	description: 'sends the timetable to the user',
	usage:
		'!timetable or !timetable <@mention> or !timetable <branch> <section> <year> <semester> \n\t Ex: !timetable IT A 4 1 or !timetable @mandeep',
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
			} else if (args.length === 1 && taggedUser.length === 0) {
				userData = await db
					.collection<student>(collection.student)
					.findOne({ rollNo: args[0] });
				//userData = await User.findOne({ rollNo: args[0] });
			} else if (args.length === 0 && taggedUser.length === 0) {
				userData = await db.collection<student>(collection.student).findOne({
					mobileNo: (message.author as string).split('@')[0],
				});
				// userData = await User.findOne({
				// 	mobileNo: (message.author as string).split('@')[0],
				// });
			} else if (args.length > 0) {
				userData = {
					branch: args[0],
					section: args[1],
					yearOfStudy: args[2],
					semester: args[3],
				};
			}

			let timetable = MessageMedia.fromFilePath(
				resolve(
					__dirname,
					'../Assets/timetables',
					(userData?.branch as string).toLowerCase(),
					`${userData?.yearOfStudy}-${userData?.semester}`,
					(userData?.section as string).toLowerCase(),
					'timetable.png'
				)
			);
			client.sendMessage(message.from, timetable);
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
