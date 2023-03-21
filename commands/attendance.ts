import WAWebJS, { MessageMedia } from 'whatsapp-web.js';
import QuickChart from 'quickchart-js';
import { fail } from '../utils/chalk';
import { collection } from '../utils/collection';
import { db } from '../utils/db';
import { student } from '../Models/models';

export default {
	name: 'attendance',
	type: 'user',
	description: 'for fetching attendance details',
	usage:
		'!attendance <rollNo> or !attendance <@mention>\n\t Ex: !attendance 19S11A1208 or !attendance @mandeep',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let taggedUser = await message.getMentions();
			let userData: any;
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
			} else {
				userData = await db.collection<student>(collection.student).findOne({
					mobileNo: (message.author as string).split('@')[0],
				});
			}
			if (userData && userData.userType === 'student') {
				let userPresent =
					userData.attendance.noWorkingDays - userData.attendance.absent.length;

				let avg = await db
					.collection<student>(collection.student)
					.aggregate([
						{ $match: { attendance: { $ne: null } } },
						{
							$group: {
								_id: {
									yearOfStudy: '$yearOfStudy',
									branch: '$branch',
									semester: '$semester',
								},
								avg: { $avg: { $size: '$attendance.absent' } },
							},
						},
					])
					.toArray();
				console.log(avg);
				let requiredArr = avg.filter(
					(data: any) =>
						data._id.yearOfStudy === userData?.yearOfStudy &&
						data._id.branch === userData?.branch &&
						data._id.semester === userData?.semester
				);
				console.log(requiredArr);
				let averageAttendance =
					userData.attendance.noWorkingDays - requiredArr[0].avg;

				const myChart = new QuickChart();
				myChart.setConfig({
					type: 'bar',
					data: {
						datasets: [
							{
								label: 'current attendance',
								data: [userPresent],
							},
							{ label: 'avg attendance', data: [averageAttendance] },
							{
								label: 'total working days',
								data: [userData.attendance.noWorkingDays],
							},
						],
					},
				});
				let chartBin = await myChart.toBinary();
				const media = new MessageMedia(
					'image/png',
					Buffer.from(chartBin).toString('base64')
				);
				console.log(media);
				client.sendMessage(message.from, media, {
					caption: `🌟 *Name*: ${userData.name}\n🌟 *Branch*: ${userData.branch}\n🌟 *Year*: ${userData.yearOfStudy}\n🌟 *Section*: ${userData.section}`,
				});
			} else {
				client.sendMessage(message.from, 'User not found or not a student');
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
