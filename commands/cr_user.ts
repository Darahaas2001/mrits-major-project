import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';
import { db } from '../utils/db';
import { tableConfig, tableData } from '../utils/table';
import { TableUserConfig } from 'table';
import { faculty, student, subject } from '../Models/models';
import { collection } from '../utils/collection';

export default {
	name: 'cr_user',
	type: 'admin',
	description: 'Creates new user',
	usage:
		//'!cr_user [<@mention> || <name> ] - select the role(buttons) \n\t Ex: !cr_user @mandeep ||Mandeep Andey||student||19S11A1218||4||1||IT',
		'!cr_user @mention || name\n\tEx: !cr_user @mandeep||Mandeep Andey \n\t1.Now, the admin needs to select the user Designation.\n\t2.Next, Admin needs to select(or)enter the appropirate information as instructed.\n\t3.Finally, you are prompted with the message -\n\t  "User created successfully."',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			// let userData = await db.collection<student>('user').findOne({
			// 	mobileNo: (message.author as string).split('@')[0],
			// });
			let usrObj: any = { author: message.author };
			let userObj: any = {
				name: message.body.split('||').pop(),
				mobileNo: (message.mentionedIds as Array<string>)[0].split('@')[0],
			};

			let data = [
				['1', 'HOD'],
				['2', 'Faculty'],
				['3', 'Student'],
			];

			// let buttonSpec = [
			// 	{ id: 'admin', body: 'HOD' },
			// 	{ id: 'faculty', body: 'Faculty' },
			// 	{ id: 'student', body: 'Student' },
			// ];

			// const buttons = new Buttons(
			// 	'Please select any one option',
			// 	buttonSpec,
			// 	'Creating User'
			// );
			let config: TableUserConfig = {
				...tableConfig,
				header: {
					content: '*Please select the type*\n',
					wrapWord: true,
					alignment: 'left',
				},
			};
			let msg = tableData(data, config);

			await client.sendMessage(message.from, msg);

			// Event Handlers
			let eventHandler1 = async (message: WAWebJS.Message) => {
				let usrData = { ...usrObj };
				if (!(message.author === usrData.author)) return;
				switch (message.body) {
					case '1':
						userObj['userType'] = 'admin';
						break;
					case '2':
						userObj['userType'] = 'faculty';
						break;
					case '3':
						userObj['userType'] = 'student';
						break;
					default:
						client.sendMessage(message.from, 'Option invalid');
						client.removeListener('message', eventHandler1);
						break;
				}

				let data = [
					['1', 'CSE'],
					['2', 'IT'],
					['3', 'ECE'],
				];
				// const buttons = new Buttons(
				// 	'Please select any one option',
				// 	buttonSpec,
				// 	'Creating User'
				// );
				let config: TableUserConfig = {
					...tableConfig,
					header: {
						content: '*Please select the department*\n',
						wrapWord: true,
						alignment: 'left',
					},
				};
				let msg = tableData(data, config);

				await client.sendMessage(message.from, msg);
				// await client.sendMessage(message.from, buttons);
				client.on('message', eventHandler2);
				client.removeListener('message', eventHandler1);
			};
			const eventHandler2 = async (message: WAWebJS.Message) => {
				let usrData = { ...usrObj };
				if (!(message.author === usrData.author)) return;
				switch (message.body) {
					case '1':
						userObj['branch'] = 'cse';
						break;
					case '2':
						userObj['branch'] = 'it';
						break;
					case '3':
						userObj['branch'] = 'ece';
						break;
					default:
						client.sendMessage(message.from, 'Option invalid');
						//client.removeListener('message',eventHandler2)
						break;
				}

				// if (message.selectedButtonId) userObj.branch = message.selectedButtonId;
				if (userObj.userType == 'admin' || userObj.userType == 'faculty') {
					client.sendMessage(message.from, 'Please enter your employee number');

					client.removeListener('message', eventHandler2);
					client.on('message', eventHandler3);
				} else if (userObj.userType === 'student') {
					client.sendMessage(message.from, 'Please enter your roll number');
					client.removeListener('message', eventHandler2);
					client.on('message', eventHandler3);
				}
				client.removeListener('message', eventHandler2);
			};

			const eventHandler3 = async (message: WAWebJS.Message) => {
				let usrData = { ...usrObj };
				if (!(message.author === usrData.author)) return;
				if (userObj.userType == 'admin' || userObj.userType == 'faculty') {
					userObj.empCode = message.body.toUpperCase();

					//	await db.collection<faculty>(collection.faculty).insertOne(userObj);
					client.sendMessage(
						message.from,
						'Please enter the subject you are teaching in the following format \n\n *<subject_code>[<section>,<section>,<section>],<subject_code>[<section>,<section>,<section>]*\n\n `Ex: 157AB[A,B] 159CV[C]`'
					);
					client.removeListener('message', eventHandler3);
					client.on('message', teachingSubjectsHandler);
				} else if (userObj.userType == 'student') {
					userObj.rollNo = message.body.toUpperCase();
					client.removeListener('message', eventHandler3);

					let data = [
						['1', 'I Year'],
						['2', 'II Year'],
						['3', 'III Year'],
						['4', 'IV Year'],
					];
					let config: TableUserConfig = {
						...tableConfig,
						header: {
							content: '*Please select the year of Studying*\n',
							wrapWord: true,
							alignment: 'left',
						},
					};
					let msg = tableData(data, config);

					await client.sendMessage(message.from, msg);
					// let listSpec = [
					// 	{
					// 		title: 'Enter Year',
					// 		rows: [
					// 			{ id: '1', title: 'I' },
					// 			{ id: '2', title: 'II' },
					// 			{ id: '3', title: 'III' },
					// 			{ id: '4', title: 'IV' },
					// 		],
					// 	},
					// ];
					//let list = new List('Select your year of study', 'next', listSpec);
					// let buttonSpec = [
					// 	{ id: '1', body: 'I' },
					// 	{ id: '2', body: 'II' },
					// 	{ id: '3', body: 'III' },
					// 	{ id: '4', body: 'IV' },
					// ];
					// const buttons = new Buttons(
					// 	'Please select any one option',
					// 	buttonSpec,
					// 	'Enter year of study'
					// );
					//	await client.sendMessage(message.from, list);
					client.on('message', eventHandler4);
				}
				client.removeListener('message', eventHandler3);
			};
			const teachingSubjectsHandler = async (message: WAWebJS.Message) => {
				let msgData = message.body;
				let regexp = new RegExp(/([^[]+(?=]))/, 'g');
				userObj.teachingSubjects = [];
				for (const msgs of msgData.split(' ')) {
					let section = msgs.match(regexp)?.pop() as string;
					let subCode = msgs.split('[')[0];
					let subData = await db
						.collection<subject>(collection.subject)
						.findOne({ subjectCode: subCode });
					if (!subData) {
						await client.sendMessage(
							message.from,
							`The subject code *${subCode}* is not found in subject database`
						);
						client.removeListener('message', teachingSubjectsHandler);
						return;
					}
					userObj.teachingSubjects.push({
						subjectCode: subCode,
						section: section.split(','),
					});
				}
				await db.collection<faculty>(collection.faculty).insertOne(userObj);
				await client.sendMessage(message.from, 'User created successfully');
				client.removeListener('message', teachingSubjectsHandler);
			};
			const eventHandler4 = async (message: WAWebJS.Message) => {
				let usrData = { ...usrObj };
				if (!(message.author === usrData.author)) return;

				if (parseInt(message.body) > 0 && parseInt(message.body) <= 4) {
					userObj['yearOfStudy'] = message.body;
				} else {
					return await client.sendMessage(message.from, 'Option Invalid');
				}

				//	if (message.selectedRowId) userObj.yearOfStudy = message.selectedRowId;
				// let buttonSpec = [
				// 	{ id: '1', body: 'I' },
				// 	{ id: '2', body: 'II' },
				// ];

				let data = [
					['1', 'I'],
					['2', 'II'],
				];
				let config: TableUserConfig = {
					...tableConfig,
					header: {
						content: '*Please select the semester of study*\n',
						wrapWord: true,
						alignment: 'left',
					},
				};
				let msg = tableData(data, config);

				await client.sendMessage(message.from, msg);

				// const buttons = new Buttons(
				// 	'Please select any one option',
				// 	buttonSpec,
				// 	'Enter Semester of study'
				// );
				// await client.sendMessage(message.from, buttons);
				client.on('message', eventHandler5);
				client.removeListener('message', eventHandler4);
			};
			const eventHandler5 = async (message: WAWebJS.Message) => {
				let usrData = { ...usrObj };
				if (!(message.author === usrData.author)) return;
				if (parseInt(message.body) > 0 && parseInt(message.body) <= 2) {
					userObj['semester'] = message.body;
				} else {
					return await client.sendMessage(message.from, 'Option Invalid');
				}

				// let listSpec = [
				// 	{
				// 		title: 'Enter section',
				// 		rows: [
				// 			{ id: 'a', title: 'A' },
				// 			{ id: 'b', title: 'B' },
				// 			{ id: 'c', title: 'C' },
				// 			{ id: 'd', title: 'D' },
				// 		],
				// 	},
				// ];
				// let list = new List('Select your section', 'next', listSpec);
				// // let buttonSpec = [
				// // 	{ id: 'a', body: 'A' },
				// // 	{ id: 'b', body: 'B' },
				// // 	{ id: 'c', body: 'C' },
				// // 	{ id: 'd', body: 'D' },
				// // ];
				// // const buttons = new Buttons(
				// // 	'Please select your section',
				// // 	buttonSpec,
				// // 	'Creating User'
				// // );
				// await client.sendMessage(message.from, list);
				let data = [
					['1', 'A'],
					['2', 'B'],
					['3', 'C'],
					['4', 'D'],
				];
				let config: TableUserConfig = {
					...tableConfig,
					header: {
						content: '*Please select the section*\n',
						wrapWord: true,
						alignment: 'left',
					},
				};
				let msg = tableData(data, config);

				await client.sendMessage(message.from, msg);
				client.removeListener('message', eventHandler5);

				client.on('message', finalHandler);
			};
			const finalHandler = async (message: WAWebJS.Message) => {
				let usrData = { ...usrObj };
				if (!(message.author === usrData.author)) return;
				switch (message.body) {
					case '1':
						userObj['section'] = 'a';
						break;
					case '2':
						userObj['section'] = 'b';
						break;
					case '3':
						userObj['section'] = 'c';
						break;
					case '4':
						userObj['section'] = 'd';
					default:
						client.sendMessage(message.from, 'Option invalid');
						//client.removeListener('message',eventHandler2)
						break;
				}
				//	if (message.selectedRowId) userObj.section = message.selectedRowId;
				await db.collection<student>(collection.student).insertOne(userObj);
				await client.sendMessage(message.from, 'User created successfully');
				client.removeListener('message', finalHandler);
			};

			client.on('message', eventHandler1);

			// let userData = await User.findOne({
			// 	mobileNo: (message.author as string).split('@')[0],
			// });

			// if (userData && userData.userType !== userType.student) {

			// 	let matchedArr = message.body.split('||') as string[];
			// 	matchedArr.shift();

			// 	let mobileNum = (message.mentionedIds as Array<string>)[0];
			// 	mobileNum = mobileNum.split('@')[0];

			// 	if (
			// 		userData.userType === userType.faculty &&
			// 		matchedArr![1] === userType.admin.toString()
			// 	)
			// 		client.sendMessage(
			// 			message.from,
			// 			'Unauthorized creation of admin by faculty'
			// 		);
			// 	let userobj = {
			// 		name: matchedArr![0],
			// 		userType: matchedArr![1],
			// 		rollNo: matchedArr![2],
			// 		yearOfStudy: +matchedArr![3],
			// 		semester: +matchedArr![4],
			// 		branch: matchedArr![5],
			// 		section: matchedArr![6] || 'A',
			// 		mobileNo: +mobileNum,
			// 	};
			// 	await db.collection<user>('user').insertOne(userobj);
			// 	//await User.create(userobj);

			// 	client.sendMessage(message.from, 'User Created Successfully');
			// } else {
			// 	client.sendMessage(message.from, 'User unauthorized');
			// }
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
