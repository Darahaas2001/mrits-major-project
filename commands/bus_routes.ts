import WAWebJS from 'whatsapp-web.js';
import { fail } from '../utils/chalk';
import busRoutes from '../utils/bus_routes.json';

export default {
	name: 'bus_routes',
	type: 'user',
	description: 'Shows all the bus routes information',
	usage: '!bus_routes',

	exec: async (
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		args: string[]
	) => {
		try {
			let msg = '';
			for (const bus of busRoutes) {
				msg += `💠 *Bus* : ${bus.busNo}\n💠 *Driver* : ${bus.driverName}\n💠 *Contact*: ${bus.phoneNo}\n💠 *Routes* :`;
				for (const route of bus.routes) {
					msg += ` → ${route}  `;
				}
				msg += '\n\n';
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
