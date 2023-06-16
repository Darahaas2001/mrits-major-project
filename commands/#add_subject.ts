import WAWebJS from 'whatsapp-web.js';
import { Buttons, List } from 'whatsapp-web.js';
// import User from '../Models/user.model';
import { fail } from '../utils/chalk';
import { db } from '../utils/db';
import { faculty, student, subject, userType } from '../Models/models';
import { collection } from '../utils/collection';

export default {
	name: 'add_subject',
	type: 'admin',
	description: 'Creates new subject',
	usage: '!add_subject\n\tAdmin needs to select(or)enter the necessary information as instructed. \n\t1.Select the Branch\n\t2.Select the Regulation\n\t3.Select the Year\n\t4.Select the Semester\n\t5.Please enter the subject code as per JNTU-H\n\t6.Please enter the subject name as per JNTU-H\n\t7.Finally, you are prompted with the message -\n\t  "Subject has been added successfully."',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let dataObj: subject | any = {};
			let userData = await db
				.collection<faculty>(collection.faculty)
				.findOne({ mobileNo: (message.author as string).split('@')[0] });
			if (userData) {
				let listSpec = [
					{
						title: 'Select the Branch',
						rows: [
							{ id: 'cse', title: 'CSE' },
							{ id: 'it', title: 'IT' },
							{ id: 'ece', title: 'ECE' },
						],
					},
				];
				let list = new List('Select the Branch', 'next', listSpec);
				client.sendMessage(message.from, list);
				const eventHandler1 = async (message: WAWebJS.Message) => {
					if (!message.selectedRowId) {
						return client.removeListener('message', eventHandler1);
					}
					console.log(message.selectedRowId);
					dataObj.branch = message.selectedRowId;
					let listSpec = [
						{
							title: 'Select the Regulation',
							rows: [
								{ id: 'r18', title: 'R-18' },
								{ id: 'r20', title: 'R-20' },
								{ id: 'r22', title: 'R-22' },
							],
						},
					];
					let list = new List('Select the Regulation', 'next', listSpec);
					client.sendMessage(message.from, list);
					client.removeListener('message', eventHandler1);
					client.on('message', eventHandler2);
				};
				const eventHandler2 = async (message: WAWebJS.Message) => {
					if (!message.selectedRowId) {
						return client.removeListener('message', eventHandler2);
					}
					dataObj.regulation = message.selectedRowId;
					let listSpec = [
						{
							title: 'Select the Year',
							rows: [
								{ id: '1', title: 'I' },
								{ id: '2', title: 'II' },
								{ id: '3', title: 'III' },
								{ id: '4', title: 'IV' },
							],
						},
					];
					let list = new List('Select the Year', 'next', listSpec);
					client.sendMessage(message.from, list);
					client.removeListener('message', eventHandler2);
					client.on('message', eventHandler3);
				};
				const eventHandler3 = async (message: WAWebJS.Message) => {
					if (!message.selectedRowId) {
						return client.removeListener('message', eventHandler3);
					}
					dataObj.yearOfStudy = parseInt(message.selectedRowId);
					let listSpec = [
						{
							title: 'Select the Semester',
							rows: [
								{ id: '1', title: 'I' },
								{ id: '2', title: 'II' },
							],
						},
					];
					let list = new List('Select the Semester', 'next', listSpec);
					client.sendMessage(message.from, list);
					client.removeListener('message', eventHandler3);
					client.on('message', eventHandler4);
				};

				const eventHandler4 = async (message: WAWebJS.Message) => {
					if (!message.selectedRowId) {
						return client.removeListener('message', eventHandler4);
					}
					dataObj.semester = parseInt(message.selectedRowId);
					client.sendMessage(
						message.from,
						'Please enter the subject code as per JNTU-H'
					);
					client.removeListener('message', eventHandler4);
					client.on('message', eventHandler5);
				};

				const eventHandler5 = async (message: WAWebJS.Message) => {
					if (!message.body) client.removeListener('message', eventHandler5);
					dataObj.subjectCode = message.body.toUpperCase();
					client.sendMessage(
						message.from,
						'Please enter the subject name as per JNTU-H'
					);
					client.removeListener('message', eventHandler5);
					client.on('message', eventHandler6);
				};
				const eventHandler6 = async (message: WAWebJS.Message) => {
					if (!message.body) client.removeListener('message', eventHandler6);
					dataObj.subjectName = message.body.toUpperCase();
					await db.collection<subject>(collection.subject).insertOne(dataObj);
					client.sendMessage(
						message.from,
						'Subject has been added successfully.'
					);
				};
				client.on('message', eventHandler1);
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
