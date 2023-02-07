import WAWebJS from 'whatsapp-web.js';
import { Buttons, List } from 'whatsapp-web.js';
// import User from '../Models/user.model';
import { fail } from '../utils/chalk';
import { db } from '../utils/db';
import { faculty, student, userType } from '../Models/models';
import { collection } from '../utils/collection';

export default {
	name: 'cr_user',
	type: 'admin',
	description: 'Creates new user',
	usage:
		'!cr_user [<@mention> || <name> ] - select the role(buttons) \n\t Ex: !cr_user @mandeep ||Mandeep Andey||student||19S11A1218||4||1||IT',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			// let userData = await db.collection<student>('user').findOne({
			// 	mobileNo: (message.author as string).split('@')[0],
			// });
			let userObj: any = {
				name: message.body.split('||').pop(),
				mobileNo: (message.mentionedIds as Array<string>)[0].split('@')[0],
			};

			let buttonSpec = [
				{ id: 'admin', body: 'HOD' },
				{ id: 'faculty', body: 'Faculty' },
				{ id: 'student', body: 'Student' },
			];

			const buttons = new Buttons(
				'Please select any one option',
				buttonSpec,
				'Creating User'
			);

			await client.sendMessage(message.from, buttons);

			// Event Handlers
			let eventHandler1 = async (message: WAWebJS.Message) => {
				switch (message.selectedButtonId) {
					case 'admin':
						userObj['userType'] = userType.admin;
						break;
					case 'faculty':
						userObj['userType'] = userType.faculty;
						break;

					default:
						userObj['userType'] = 'student';
						break;
				}

				let buttonSpec = [
					{ id: 'cse', body: 'CSE' },
					{ id: 'ece', body: 'ECE' },
					{ id: 'it', body: 'IT' },
				];
				const buttons = new Buttons(
					'Please select any one option',
					buttonSpec,
					'Creating User'
				);
				await client.sendMessage(message.from, buttons);
				client.on('message', eventHandler2);
				client.removeListener('message', eventHandler1);
			};
			const eventHandler2 = async (message: WAWebJS.Message) => {
				if (message.selectedButtonId) userObj.branch = message.selectedButtonId;
				if (
					userObj.userType == userType.admin ||
					userObj.userType == userType.faculty
				) {
					client.sendMessage(message.from, 'Please enter your employee number');

					client.removeListener('message', eventHandler2);
				} else if (userObj.userType === 'student') {
					client.sendMessage(message.from, 'Please enter your roll number');
					client.on('message', eventHandler3);
					client.removeListener('message', eventHandler2);
				}
				client.removeListener('message', eventHandler2);
			};

			const eventHandler3 = async (message: WAWebJS.Message) => {
				if (
					userObj.userType == userType.faculty ||
					userObj.userType == userType.admin
				) {
					userObj.empCode = message.body.toUpperCase();

					await db.collection<faculty>(collection.faculty).insertOne(userObj);
					client.removeListener('message', eventHandler3);
				} else if (userObj.userType == 'student') {
					userObj.rollNo = message.body.toUpperCase();
					client.removeListener('message', eventHandler3);
					let listSpec = [
						{
							title: 'Enter Year',
							rows: [
								{ id: '1', title: 'I' },
								{ id: '2', title: 'II' },
								{ id: '3', title: 'III' },
								{ id: '4', title: 'IV' },
							],
						},
					];
					let list = new List('Select your year of study', 'next', listSpec);
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
					await client.sendMessage(message.from, list);
					client.on('message', eventHandler4);
				}
				client.removeListener('message', eventHandler3);
			};

			const eventHandler4 = async (message: WAWebJS.Message) => {
				if (message.selectedRowId) userObj.yearOfStudy = message.selectedRowId;
				let buttonSpec = [{ id: '1', body: 'I' }, { id: '2', body: 'II' }, ,];
				const buttons = new Buttons(
					'Please select any one option',
					buttonSpec,
					'Enter Semester of study'
				);
				await client.sendMessage(message.from, buttons);
				client.on('message', eventHandler5);
				client.removeListener('message', eventHandler4);
			};
			const eventHandler5 = async (message: WAWebJS.Message) => {
				if (message.selectedButtonId)
					userObj.semester = message.selectedButtonId;

				let listSpec = [
					{
						title: 'Enter section',
						rows: [
							{ id: 'a', title: 'A' },
							{ id: 'b', title: 'B' },
							{ id: 'c', title: 'C' },
							{ id: 'd', title: 'D' },
						],
					},
				];
				let list = new List('Select your section', 'next', listSpec);
				// let buttonSpec = [
				// 	{ id: 'a', body: 'A' },
				// 	{ id: 'b', body: 'B' },
				// 	{ id: 'c', body: 'C' },
				// 	{ id: 'd', body: 'D' },
				// ];
				// const buttons = new Buttons(
				// 	'Please select your section',
				// 	buttonSpec,
				// 	'Creating User'
				// );
				await client.sendMessage(message.from, list);
				client.removeListener('message', eventHandler5);

				client.on('message', finalHandler);
			};
			const finalHandler = async (message: WAWebJS.Message) => {
				if (message.selectedRowId) userObj.section = message.selectedRowId;
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
