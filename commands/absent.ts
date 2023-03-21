import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';
import { db } from '../utils/db';
// import User from '../Models/user.model';
import moment from 'moment';
import { student, faculty } from '../Models/models';
import { collection } from '../utils/collection';

export default {
	name: 'absent',
	type: 'admin',
	description: 'marking attendance of the students',
	usage:
		'!absent <rollNo> <rollNo> <rollNo>\n\t Ex: *!absent 19S11A1218 19S11A1208*',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let userData = await db
				.collection<faculty>(collection.faculty)
				.findOne({ mobileNo: (message.author as string).split('@')[0] });

			// let userData = await User.findOne({
			// 	mobileNo: (message.author as string).split('@')[0],
			// });

			if (userData) {
				for (const rollNo of args) {
					let student = await db
						.collection<student>(collection.student)
						.findOne({ rollNo });
					//	let student = await User.findOne({ rollNo });
					if (
						student?.userType === 'student' &&
						student.attendance &&
						(student.attendance as any).semester === student.semester
					) {
						let dateNow = moment(new Date(Date.now()))
							.add(5, 'hours')
							.add(30, 'minutes')
							.format('dddd, MMMM Do YYYY');
						let msg = `Student with Roll No: *${student.rollNo}* is absent on ${dateNow}, kindly be regular to college`;

						await db.collection<student>(collection.student).findOneAndUpdate(
							{ rollNo },

							{
								$push: { 'attendance.absent': new Date(Date.now()) },
							}
						);

						// await User.findOneAndUpdate(
						// 	{ rollNo },
						// 	{ $push: { 'attendance.absent': new Date(Date.now()) } }
						// );

						client.sendMessage(`${student.mobileNo}@c.us`, msg);
					} else if (student?.userType === 'student' && !student.attendance) {
						let dateNow = moment(new Date(Date.now()))
							.add(5, 'hours')
							.add(30, 'minutes')
							.format('dddd, MMMM Do YYYY');

						await db.collection<student>(collection.student).findOneAndUpdate(
							{ rollNo },
							{
								$set: {
									attendance: {
										semester: student.semester,
										yearOfStudy: student.yearOfStudy,
										noWorkingDays: 100,
										absent: [new Date(Date.now())],
									},
								},
							}
						);

						// await User.findOneAndUpdate(
						// 	{ rollNo },
						// 	{
						// 		attendance: {
						// 			semester: student.semester,
						// 			yearOfStudy: student.yearOfStudy,
						// 			noWorkingDays: 100,
						// 			absent: [new Date(Date.now())],
						// 		},
						// 	}
						// );
						let msg = `Student with Roll No: *${student.rollNo}* is absent on ${dateNow}, kindly be regular to college`;
						client.sendMessage(`${student.mobileNo}@c.us`, msg);
					} else {
						return client.sendMessage(
							message.from,
							`Student with rollNo ${rollNo} not found`
						);
					}
				}
				client.sendMessage(message.from, `Updated Attendance successfully`);
			} else {
				client.sendMessage(message.from, 'Unauthorized User');
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
