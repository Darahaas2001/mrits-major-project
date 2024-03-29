import WAWebJS, { List } from 'whatsapp-web.js';

import { db } from '../utils/db';
import { fail } from '../utils/chalk';
import { collection } from '../utils/collection';
import {
	assignment,
	faculty,
	student,
	subAssignment,
	subject,
} from '../Models/models';

import moment from 'moment';

export default {
	name: 'add_assignment',
	type: 'admin',
	description: 'Creates a new assignment for students',
	usage:
		//'!add_assignment ||<branch>||<year>||<semester>||<section>||<subject name>||<assignment no>||<deadline>||<description>\n\t Ex: !add_assignment ||IT||4||1||A||RS&GIS||1||10-10-2022||Remote Sensing assignment 1',
		'!add_assignment\n\tAdmin needs to select(or)enter the necessary information as instructed. \n\t1.Select your subject of teaching\n\t2.Please enter the assignment deadline in dd/mm/yyyy\n\t3.Enter the assignment description\n\t4.Finally, you are prompted with the message -\n\t  "Assignment has been added successfully"',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let dataObj: assignment = Object.create({});
			let userData = await db.collection<faculty>(collection.faculty).findOne({
				mobileNo: (message.author as string).split('@')[0],
			});
			// let userData = await User.findOne({
			// 	mobileNo: (message.author as string).split('@')[0],
			// });

			if (userData) {
				let facultyData = userData;
				let listSpec: any[] = [{ title: 'Select Subject', rows: [] }];
				for (const subject of facultyData?.teachingSubjects!) {
					let subName = await db
						.collection<subject>(collection.subject)
						.findOne({ subjectCode: subject.subjectCode });
					listSpec[0].rows.push({
						id: subName?.subjectCode,
						title: subName?.subjectName.toUpperCase(),
					});
				}
				let list = new List(
					'Select your subject of teaching',
					'next',
					listSpec
				);

				await client.sendMessage(message.from, list);

				const eventHandler1 = async (message: WAWebJS.Message) => {
					if (!message.selectedRowId)
						client.removeListener('message', eventHandler1);
					let subjectData = await db
						.collection<subject>(collection.subject)
						.findOne({ subjectCode: message.selectedRowId });

					let section = facultyData?.teachingSubjects.filter(
						(obj) => obj.subjectCode === message.selectedRowId
					)!;

					dataObj.yearOfStudy = subjectData?.yearOfStudy!;
					dataObj.semester = subjectData?.semester!;
					dataObj.branch = subjectData?.branch!;
					dataObj.section = section[0].section[0];
					dataObj.assignment = [];
					dataObj.assignment.push(Object.create({}));
					dataObj.assignment[0].subjectCode = subjectData?.subjectCode!;

					//dataObj.assignment[0].subjectCode = subjectData?.subjectCode!;
					client.removeListener('message', eventHandler1);
					client.sendMessage(
						message.from,
						'Please enter the assignment deadline in *dd/mm/yyyy*'
					);

					client.on('message', eventHandler2);
				};
				const eventHandler2 = async (message: WAWebJS.Message) => {
					if (!moment(message.body, 'DD-MM-YYYY', false).toDate()) {
						client.sendMessage(message.from, 'Invalid date format');
						return client.removeListener('message', eventHandler2);
					}
					dataObj.assignment[0].deadLine = moment(
						message.body,
						'DD-MM-YYYY',
						false
					).toDate();
					client.sendMessage(message.from, 'Enter the assignment description');
					client.removeListener('message', eventHandler2);
					client.on('message', eventHandler3);
				};

				const eventHandler3 = async (message: WAWebJS.Message) => {
					if (!message.body) client.removeListener('message', eventHandler3);

					dataObj.assignment[0].description = message.body;
					client.removeListener('message', eventHandler3);
					let assignmentData = await db
						.collection<assignment>(collection.assignment)
						.findOne({
							yearOfStudy: dataObj.yearOfStudy,
							semester: dataObj.semester,
							branch: dataObj.branch,
							section: dataObj.section,
						});

					if (assignmentData) {
						await db
							.collection<assignment>(collection.assignment)
							.findOneAndUpdate(
								{
									yearOfStudy: dataObj.yearOfStudy,
									semester: dataObj.semester,
									branch: dataObj.branch,
									section: dataObj.section,
								},
								{ $push: { assignment: dataObj.assignment[0] } }
							);
					} else {
						await db
							.collection<assignment>(collection.assignment)
							.insertOne(dataObj);
					}
					client.sendMessage(
						message.from,
						'Assignment has been added successfully'
					);
				};
				client.on('message', eventHandler1);
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
