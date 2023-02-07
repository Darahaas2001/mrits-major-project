export const messageCheck = (message: string) => {
	if (message.startsWith('!')) {
		let newMessage = message.replace('!', '');
		let args = newMessage.split(' ');
		let cmd = args.shift() as string;
		return { status: true, cmd, args };
	}
	return { status: false };
};
