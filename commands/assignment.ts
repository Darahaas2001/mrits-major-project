import { extname } from 'path';
import WAWebJS, { List } from 'whatsapp-web.js';
import { uploadFile } from '../utils/googleDrive';
import { fail } from '../utils/chalk';
import { db } from '../utils/db';
import { faculty, student, assignment } from '../Models/models';
import { collection } from '../utils/collection';

export default {
	name: 'assignment',
	type: 'user',
	description: 'Lists assignments and submits assignments',
	usage: '!assignment',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let listSpec = [
				{
					title: 'Select an option',
					rows: [
						{ id: 'list', title: 'List assignments' },
						{ id: 'submit', title: 'Submit assignment' },
						{
							id: 'listsubmit',
							title:
								'List of students who submitted the assignment (faculty only)',
						},
					],
				},
			];
			let list = new List('Select an option', 'next', listSpec);
			client.sendMessage(message.from, list);

			const eventHandler1 = async (message: WAWebJS.Message) => {
				if (!message.selectedRowId)
					client.removeListener('message', eventHandler1);
				if (message.selectedRowId === 'list') {
					let studentData = await db
						.collection<student>(collection.student)
						.findOne({ mobileNo: (message.author as string).split('@')[0] });
					let facultyData = await db
						.collection<faculty>(collection.faculty)
						.findOne({ mobileNo: (message.author as string).split('@')[0] });
					let userData = studentData || facultyData;
					if (userData && userData.userType !== 'student') {
						for (const subject of userData.teachingSubjects) {
							let assignmentData = await db
								.collection<assignment>(collection.assignment)
								.findOne({
									branch: userData.branch,
									'assignment.subjectCode': subject.subjectCode,
								});
							console.log(assignmentData);
						}
					}
				}
			};

			client.on('message', eventHandler1);
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
