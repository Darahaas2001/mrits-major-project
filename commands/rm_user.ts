import WAWebJS from 'whatsapp-web.js';
import { student, faculty } from '../Models/models';
import { db } from '../utils/db';
import { collection } from '../utils/collection';

import { fail } from '../utils/chalk';

export default {
	name: 'rm_user',
	type: 'admin',
	description: 'removes existing user',
	usage: '!rm_user <@mention>\t\n Ex: !rm_user @mandeep',

	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let facultyData = await db
				.collection<faculty>(collection.faculty)
				.findOne({ mobileNo: (message.author as string).split('@')[0] });
			let studentData = await db
				.collection<student>(collection.student)
				.findOne({ mobileNo: (message.author as string).split('@')[0] });
			let userData = facultyData || studentData;
			let taggedUser = await message.getMentions();
			if (userData && userData?.userType === 'admin' && taggedUser[0].number) {
				await db
					.collection<faculty>(collection.faculty)
					.findOneAndDelete({ mobileNo: taggedUser[0].number });
				await db
					.collection<student>(collection.student)
					.findOneAndDelete({ mobileNo: taggedUser[0].number });
				//await User.findOneAndDelete({ mobileNo: taggedUser[0].number });
				client.sendMessage(message.from, 'User deleted successfully');
			} else if (
				userData &&
				userData?.userType === 'faculty' &&
				taggedUser[0].number
			) {
				let requestedUser = await db
					.collection<student>(collection.student)
					.findOne({ mobileNo: taggedUser[0].number });
				if (requestedUser && requestedUser?.userType === 'student') {
					await db
						.collection<student>(collection.student)
						.findOneAndDelete({ mobileNo: taggedUser[0].number });
				} else {
					client.sendMessage(message.from, 'User unauthorized');
				}
			} else {
				client.sendMessage(message.from, 'User unauthorized');
			}
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
