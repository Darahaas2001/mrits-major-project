import WAWebJS from 'whatsapp-web.js';

export class messageListener {
	client;
	message;
	author;
	constructor(
		client: WAWebJS.Client,
		message: WAWebJS.Message,
		author: string
	) {
		this.client = client;
		this.message = message;
		this.author = author;
	}
	MessageHandler(message: WAWebJS.Message) {
		if (message.from === this.author) {
			this.destroyMessage();
			return message.body;
		}
	}

	public listenMessage() {
		const a = this.client.on('message', this.MessageHandler);
		return a;
	}

	public destroyMessage() {
		this.client.removeListener('message', this.MessageHandler);
	}
}
