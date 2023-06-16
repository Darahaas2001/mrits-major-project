import WAWebJS, { Buttons, List } from 'whatsapp-web.js';
import { fail } from '../utils/chalk';

export default {
	name: 'material',
	type: 'user',
	description: 'Study material for the students',
	usage: '!material',
	exec: (client: WAWebJS.Client, message: WAWebJS.Message, args: string[]) => {
		try {
			// // const buttons = new Buttons(
			// // 	'select a button',
			// // 	[
			// // 		{ id: 'cse', body: 'CSE' },
			// // 		{ id: 'it', body: 'IT' },
			// // 		{ id: 'ece', body: 'ECE' },
			// // 	],
			// // 	'Please select your branch'
			// // );
			// const list = new List(
			// 	'please select a branch',
			// 	'Department',
			// 	[
			// 		{
			// 			title: 'Select Your Department',
			// 			rows: [
			// 				{ id: 'cse', title: 'CSE', description: 'Computer Science' },
			// 				{ id: 'it', title: 'IT', description: 'Information Technology' },
			// 			],
			// 		},
			// 	],
			// 	'Select Your Department'
			// );

			// const list = [
			// 	{ id: 'cse', title: 'CSE', description: 'Computer Science' },
			// 	{ id: 'it', title: 'IT', description: 'Information Technology' },
			// 	{
			// 		id: 'ece',
			// 		title: 'ECE',
			// 		description: 'Electronics And Communication',
			// 	},
			// ];
			let listSpec = [
				{
					title: 'Enter the branch',
					rows: [
						{ id: 'cse', title: 'CSE' },
						{ id: 'it', title: 'IT' },
						{ id: 'ece', title: 'ECE' },
					],
				},
			];
			let list = new List('Select the branch', 'next', listSpec);
			client.sendMessage(message.from, list);
			// let msg = `*Please select your branch*\n`;
			// list.forEach((li, i) => (msg += `${i + 1}) ${li.title} \n`));
			// msg += '\n```Select your option i.e CSE,IT,ECE```';

			// client.sendMessage(message.from as string, msg);
			const messageHandler = (message: WAWebJS.Message) => {
				if (message.selectedRowId && message.selectedRowId === 'cse') {
					client.sendMessage(
						message.from as string,
						'https://drive.google.com/drive/folders/1EslwKZP1uL_OruoBGkH3eSCiCmJ_b9qy?usp=sharing'
					);
				} else if (message.selectedRowId && message.selectedRowId === 'ece') {
					client.sendMessage(
						message.from as string,
						'https://drive.google.com/drive/folders/1VkpDuIDIiqcM63Usjtcv0EZGxHM9FrOT?usp=sharing'
					);
				} else if (message.selectedRowId && message.selectedRowId === 'it') {
					client.sendMessage(
						message.from as string,
						'https://drive.google.com/drive/folders/1jg-n3y6vL8YvSoRt_MDJmZIpBK0W77SP?usp=sharing'
					);
				}

				// if (message.body.toLowerCase().trim() === 'cse') {
				// 	client.sendMessage(
				// 		message.from as string,
				// 		'https://drive.google.com/drive/folders/1EslwKZP1uL_OruoBGkH3eSCiCmJ_b9qy?usp=sharing'
				// 	);
				// } else if (message.body.toLowerCase().trim() === 'it') {
				// 	client.sendMessage(
				// 		message.from as string,
				// 		'https://drive.google.com/drive/folders/1jg-n3y6vL8YvSoRt_MDJmZIpBK0W77SP?usp=sharing'
				// 	);
				// } else if (message.body.toLowerCase().trim() === 'ece') {
				// 	client.sendMessage(
				// 		message.from as string,
				// 		'https://drive.google.com/drive/folders/1VkpDuIDIiqcM63Usjtcv0EZGxHM9FrOT?usp=sharing'
				// 	);
				// }
				client.removeListener('message', messageHandler);
			};

			client.on('message', messageHandler);
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
