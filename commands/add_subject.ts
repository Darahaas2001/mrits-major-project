import WAWebJS from 'whatsapp-web.js';
import { tableConfig, tableData } from '../utils/table';
import { TableUserConfig } from 'table';
// import User from '../Models/user.model';
import { fail } from '../utils/chalk';
import { db } from '../utils/db';
import { faculty, subject } from '../Models/models';
import { collection } from '../utils/collection';

export default {
	name: 'add_subject',
	type: 'admin',
	description: 'Creates new subject',
	usage:
		'!add_subject\n\tAdmin needs to select(or)enter the necessary information as instructed.\n\t1.Select the _*Branch*_ by entering the appropriate selection number.\n\t2.Select the _*Regulation*_ by entering the appropriate selection number.\n\t3.Select the _*Year of Study*_ by entering the appropriate selection number.\n\t4.Select the _*Semester*_ by entering the appropriate selection number.\n\t5.Please enter the _*subject code*_ as per JNTU-H.\n\t6.Please enter the _*subject name*_ as per JNTU-H.\n\t7.Finally, you are prompted with the message -\n\t  "Subject has been added successfully."',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let usrObj: any = { author: message.author };

			let dataObj: subject | any = {};
			let userData = await db
				.collection<faculty>(collection.faculty)
				.findOne({ mobileNo: (message.author as string).split('@')[0] });
			if (userData) {
				// let listSpec = [
				// 	{
				// 		title: 'Select the Branch',
				// 		rows: [
				// 			{ id: 'cse', title: 'CSE' },
				// 			{ id: 'it', title: 'IT' },
				// 			{ id: 'ece', title: 'ECE' },
				// 		],
				// 	},
				// ];
				// let list = new List('Select the Branch', 'next', listSpec);
				// client.sendMessage(message.from, list);
				let data = [
					['1', 'CSE'],
					['2', 'IT'],
					['3', 'ECE'],
				];
				let config: TableUserConfig = {
					...tableConfig,
					header: {
						content: '*Please select the branch*\n',
						wrapWord: true,
						alignment: 'left',
					},
				};
				let msg = tableData(data, config);

				await client.sendMessage(message.from, msg);
				const eventHandler1 = async (message: WAWebJS.Message) => {
					let usrData = { ...usrObj };
					if (!(message.author === usrData.author)) return;
					switch (message.body) {
						case '1':
							dataObj.branch = 'cse';
							break;
						case '2':
							dataObj.branch = 'it';
							break;
						case '3':
							dataObj.branch = 'ece';
							break;
						default:
							client.sendMessage(message.from, 'Option invalid');
							client.removeListener('message', eventHandler1);
							break;
					}
					let data = [
						['1', 'R-18'],
						['2', 'R-20'],
						['3', 'R-22'],
					];
					let config: TableUserConfig = {
						...tableConfig,
						header: {
							content: '*Please select the regulation*\n',
							wrapWord: true,
							alignment: 'left',
						},
					};
					let msg = tableData(data, config);

					await client.sendMessage(message.from, msg);
					// let listSpec = [
					// 	{
					// 		title: 'Select the Regulation',
					// 		rows: [
					// 			{ id: 'r18', title: 'R-18' },
					// 			{ id: 'r20', title: 'R-20' },
					// 			{ id: 'r22', title: 'R-22' },
					// 		],
					// 	},
					// ];
					// let list = new List('Select the Regulation', 'next', listSpec);
					// client.sendMessage(message.from, list);
					client.removeListener('message', eventHandler1);
					client.on('message', eventHandler2);
				};
				const eventHandler2 = async (message: WAWebJS.Message) => {
					let usrData = { ...usrObj };
					if (!(message.author === usrData.author)) return;
					switch (message.body) {
						case '1':
							dataObj.regulation = 'r18';
							break;
						case '2':
							dataObj.regulation = 'r20';
							break;
						case '3':
							dataObj.regulation = 'r22';
							break;
						default:
							client.sendMessage(message.from, 'Option invalid');
							client.removeListener('message', eventHandler1);
							break;
					}

					//dataObj.regulation = message.selectedRowId;
					let data = [
						['1', 'I'],
						['2', 'II'],
						['3', 'III'],
						['4', 'IV'],
					];

					let config: TableUserConfig = {
						...tableConfig,
						header: {
							content: '*Please select the Year*\n',
							wrapWord: true,
							alignment: 'left',
						},
					};
					let msg = tableData(data, config);
					await client.sendMessage(message.from, msg);

					// let listSpec = [
					// 	{
					// 		title: 'Select the Year',
					// 		rows: [
					// 			{ id: '1', title: 'I' },
					// 			{ id: '2', title: 'II' },
					// 			{ id: '3', title: 'III' },
					// 			{ id: '4', title: 'IV' },
					// 		],
					// 	},
					// ];
					// let list = new List('Select the Year', 'next', listSpec);
					// client.sendMessage(message.from, list);
					client.removeListener('message', eventHandler2);
					client.on('message', eventHandler3);
				};
				const eventHandler3 = async (message: WAWebJS.Message) => {
					let usrData = { ...usrObj };
					if (!(message.author === usrData.author)) return;
					if (!(parseInt(message.body) > 0 && parseInt(message.body) <= 4))
						return client.sendMessage(
							message.from,
							'Invalid option, select a valid option'
						);
					dataObj.yearOfStudy = parseInt(message.body);
					let data = [
						['1', 'I'],
						['2', 'II'],
					];
					let config: TableUserConfig = {
						...tableConfig,
						header: {
							content: '*Please select the semester*\n',
							wrapWord: true,
							alignment: 'left',
						},
					};
					let msg = tableData(data, config);

					await client.sendMessage(message.from, msg);
					// let listSpec = [
					// 	{
					// 		title: 'Select the Semester',
					// 		rows: [
					// 			{ id: '1', title: 'I' },
					// 			{ id: '2', title: 'II' },
					// 		],
					// 	},
					// ];
					// let list = new List('Select the Semester', 'next', listSpec);
					// client.sendMessage(message.from, list);
					client.removeListener('message', eventHandler3);
					client.on('message', eventHandler4);
				};

				const eventHandler4 = async (message: WAWebJS.Message) => {
					let usrData = { ...usrObj };
					if (!(message.author === usrData.author)) return;
					switch (message.body) {
						case '1':
							dataObj.semester = parseInt(message.body);
							break;
						case '2':
							dataObj.semester = parseInt(message.body);
							break;

						default:
							client.sendMessage(message.from, 'Option invalid');
							client.removeListener('message', eventHandler4);
							break;
					}

					client.sendMessage(
						message.from,
						'Please enter the subject code as per JNTU-H'
					);
					client.removeListener('message', eventHandler4);
					client.on('message', eventHandler5);
				};

				const eventHandler5 = async (message: WAWebJS.Message) => {
					let usrData = { ...usrObj };
					if (!(message.author === usrData.author)) return;
					dataObj.subjectCode = message.body.toUpperCase();
					client.sendMessage(
						message.from,
						'Please enter the subject name as per JNTU-H'
					);
					client.removeListener('message', eventHandler5);
					client.on('message', eventHandler6);
				};
				const eventHandler6 = async (message: WAWebJS.Message) => {
					let usrData = { ...usrObj };
					if (!(message.author === usrData.author)) return;

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
