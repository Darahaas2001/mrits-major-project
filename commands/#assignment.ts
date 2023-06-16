import WAWebJS, { List } from 'whatsapp-web.js';
import { fail } from '../utils/chalk';
import { db } from '../utils/db';
import {
	faculty,
	student,
	assignment,
	subject,
	subAssignment,
} from '../Models/models';
import { collection } from '../utils/collection';
import moment from 'moment';
import { writeFileSync } from 'fs';
import { ObjectId } from 'mongodb';

export default {
	name: 'assignment',
	type: 'user',
	// description: 'Displays a button interface, which consists of options such as "List assignments", "Submit assignments", etc.',
	description: 'Lists assignment related options',
	usage: '!assignment \n\t And then select the approprite option.',
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
			let dataObj: Partial<subAssignment> = {};

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
						let activeAssignments: string =
							'*The list of active assignments are*';
						for (const subject of userData.teachingSubjects) {
							let assignmentData = await db
								.collection<assignment>(collection.assignment)
								.findOne({
									branch: userData!.branch,
									'assignment.subjectCode': subject.subjectCode,
								});
							if (assignmentData) {
								for (const asgnmt of assignmentData?.assignment) {
									let difference = moment(asgnmt.deadLine).diff(
										moment(Date.now()),
										'days'
									);

									if (difference >= 1) {
										let subData = await db
											.collection<subject>(collection.subject)
											.findOne({ subjectCode: asgnmt.subjectCode });
										activeAssignments += `\n ${subData?.subjectName} (${moment(
											asgnmt.deadLine
										).format('dddd-MMM-YYYY')})`;
									}
								}
							}
						}

						await client.sendMessage(message.from, activeAssignments);
						client.removeListener('message', eventHandler1);
					} else if (userData && userData.userType === 'student') {
						let assignmentData = await db
							.collection<assignment>(collection.assignment)
							.findOne({
								branch: userData.branch,
								yearOfStudy: +userData.yearOfStudy,
								section: userData.section.toUpperCase(),
								semester: +userData.semester,
							});
						let activeAssignment = '*The list of active assignments are*';
						if (assignmentData) {
							for (const asgnmt of assignmentData?.assignment) {
								let difference = moment(asgnmt.deadLine).diff(
									moment(Date.now()),
									'days'
								);

								if (difference >= 0) {
									let subData = await db
										.collection<subject>(collection.subject)
										.findOne({ subjectCode: asgnmt.subjectCode });

									activeAssignment += `\n ${subData?.subjectName} (${moment(
										asgnmt.deadLine
									).format('dddd-MMM-YYYY')})`;
								}
							}
						}
						client.removeListener('message', eventHandler1);

						await client.sendMessage(message.from, activeAssignment);
					}
				} else if (message.selectedRowId === 'submit') {
					let userData = await db
						.collection<student>(collection.student)
						.findOne({ mobileNo: (message.author as string).split('@')[0] });
					if (userData) {
						let listSpec = [
							{
								title: 'Select the assignment you want to submit',
								rows: <any>[],
							},
						];
						let assignmentData = await db
							.collection<assignment>(collection.assignment)
							.findOne({
								branch: userData.branch,
								yearOfStudy: +userData.yearOfStudy,
								section: userData.section.toUpperCase(),
								semester: +userData.semester,
							});

						if (assignmentData) {
							for (const asgnmt of assignmentData?.assignment) {
								let difference = moment(asgnmt.deadLine).diff(
									moment(Date.now()),
									'days'
								);

								if (difference >= 1) {
									let subData = await db
										.collection<subject>(collection.subject)
										.findOne({ subjectCode: asgnmt.subjectCode });
									if (subData) {
										listSpec[0].rows.push({
											id: subData.subjectCode,
											title: subData.subjectName,
										});
									}
								}
							}
							let list = new List(
								'Select the assignment you want to submit',
								'next',
								listSpec
							);
							await client.sendMessage(message.from, list);
							client.removeListener('message', eventHandler1);
							client.on('message', subjectHandler);
						}
					}
				} else if (message.selectedRowId === 'listsubmit') {
					let userData = await db
						.collection<faculty>(collection.faculty)
						.findOne({ mobileNo: (message.author as string).split('@')[0] });
					if (userData) {
						let listSpec = [
							{
								title: 'Select the assignment you list',
								rows: <any>[],
							},
						];
						for (const subject of userData.teachingSubjects) {
							let assignmentData = await db
								.collection<assignment>(collection.assignment)
								.findOne({ 'assignment.subjectCode': subject.subjectCode });
							if (assignmentData) {
								let requiredAssignment = assignmentData.assignment
									.filter(
										(assignment) =>
											assignment.subjectCode === subject.subjectCode
									)
									.pop();
								let subjectData = await db
									.collection<subject>(collection.subject)
									.findOne({ subjectCode: requiredAssignment?.subjectCode });
								listSpec[0].rows.push({
									id: requiredAssignment?.subjectCode,
									title: subjectData?.subjectName,
								});
							}
						}
						let list = new List(
							'Select the assignment you list',
							'next',
							listSpec
						);

						await client.sendMessage(message.from, list);
						client.removeListener('message', eventHandler1);
						client.on('message', listStudentHandler);
						// client.sendMessage(message.from,msgData)
					} else {
						client.removeListener('message', eventHandler1);
						client.sendMessage(message.from, 'Unauthorized user !!!');
					}
				}
			};

			const listStudentHandler = async (message: WAWebJS.Message) => {
				if (!message.selectedRowId) {
					client.removeListener('message', listStudentHandler);
				}
				let msgData = '*List of students submitted*';
				let assignmentData = await db
					.collection<assignment>(collection.assignment)
					.findOne({ 'assignment.subjectCode': message.selectedRowId });
				if (assignmentData) {
					let requiredAssignment = assignmentData.assignment
						.filter(
							(assignment) => assignment.subjectCode === message.selectedRowId
						)
						.pop();
					for (const students of requiredAssignment?.submittedStudents!) {
						let studentData = await db
							.collection<student>(collection.student)
							.findOne({ _id: new ObjectId(students.studentId) });

						msgData += `\n ${studentData?.name} *${studentData?.rollNo}*`;
					}

					client.sendMessage(message.from, msgData);
					client.removeListener('message', listStudentHandler);
				}
			};
			const subjectHandler = async (message: WAWebJS.Message) => {
				if (!message.selectedRowId)
					client.removeListener('message', subjectHandler);
				let userData = await db
					.collection<student>(collection.student)
					.findOne({ mobileNo: (message.author as string).split('@')[0] });
				if (userData) {
					dataObj.subjectCode = message.selectedRowId;
					dataObj.submittedStudents = [];
					dataObj.submittedStudents.push({
						studentId: userData._id,
						dateOfSubmission: moment(Date.now()).toDate(),
					});
					client.removeListener('message', subjectHandler);
					client.sendMessage(
						message.from,
						'Kindly upload the assignment (*In PDF format only !!!*)'
					);
					client.on('message', mediaUploadHandler);
					return;
				}
				client.sendMessage(
					message.from,
					'The student associated with this mobile number is not found !'
				);
				client.removeListener('message', subjectHandler);
			};
			const mediaUploadHandler = async (message: WAWebJS.Message) => {
				if (!message.hasMedia) {
					client.sendMessage(message.from, 'Please upload only media files');
					setTimeout(() => {
						client.sendMessage(message.from, 'Timeout for media upload !!!');
						client.removeListener('message', mediaUploadHandler);
					}, 10000);
				}

				let mediaData = await message.downloadMedia();
				if (mediaData.mimetype === 'application/pdf') {
					dataObj.submittedStudents![0].assignmentData = mediaData.data;
					let assignmentData = await db
						.collection<assignment>(collection.assignment)
						.findOne({ 'assignment.subjectCode': dataObj.subjectCode });
					if (assignmentData) {
						await db
							.collection<assignment>(collection.assignment)
							.findOneAndUpdate(
								{ 'assignment.subjectCode': dataObj.subjectCode },
								{
									$push: {
										'assignment.$.submittedStudents':
											dataObj.submittedStudents![0],
									},
								}
							);
						client.removeListener('message', mediaUploadHandler);
						return client.sendMessage(
							message.from,
							'Assignment submitted successfully'
						);
					}
					client.removeListener('message', mediaUploadHandler);
					client.sendMessage(
						message.from,
						'Assignment not found, kindly recheck'
					);
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
