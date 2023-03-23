import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';
import * as cheerio from 'cheerio';
import axios from 'axios';
export default {
	name: 'updates',
	type: 'user',
	description: 'Latest College and University updates',
	usage: '!updates',
	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let univNotification = await axios
				.get(
					'https://www.forum.universityupdates.in/forums/jntuh-notifications.15/'
				)
				.then((res) => res.data);
			let $ = cheerio.load(univNotification);
			let msg = '*JNTUH Updates*\n\n';
			for (let i = 1; i <= 10; i++) {
				let text = $(
					`div.structItem:nth-child(${i}) > div:nth-child(2) > div:nth-child(2)`
				)
					.text()
					.trim();
				msg += '➡ ' + text + '\n';
			}
			msg += '\n*College Updates*\n';
			let collegeNotification = await axios
				.get('http://mrits.ac.in/')
				.then((res) => res.data);
			let $$ = cheerio.load(collegeNotification);
			let pLen = $$(
				'div.pt-50:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > marquee > p'
			);
			let len;
			pLen.length >= 10 ? (len = 10) : (len = pLen.length);
			for (let i = 0; i <= len; i++) {
				let text = $$(
					`div.pt-50:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > marquee:nth-child(1) > p:nth-child(${i}) > a:nth-child(2)`
				)
					.text()
					.trim();

				msg += '➡ ' + text + '\n';
			}
			client.sendMessage(message.from, msg);
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
