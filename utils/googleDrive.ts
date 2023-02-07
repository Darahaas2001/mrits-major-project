import { google } from 'googleapis';

import secret from '../client_secret_553031964035-uj44vu4sq0dv3ptqrck9fkb4nm03kjqe.apps.googleusercontent.com.json';

const CLIENT_ID = secret.web.client_id;
const CLIENT_SECRET = secret.web.client_secret;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =
	'1//04xtgJ0Yz5Sq6CgYIARAAGAQSNwF-L9Ir0AXrIassHpysVgK46z1xfmm1F-Yngb1Hv_BbdcgzQDlUd03THJLlXQpakm_gggnRI9w';
const oauth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
	version: 'v3',
	auth: oauth2Client,
});

let arr: string[] = [];
const createFolder = async (folderName: string, arr: string[]) => {
	let id = await Promise.all(arr).then(async (parents) => {
		const fileMetaData = {
			name: folderName,
			parents,
			mimeType: 'application/vnd.google-apps.folder',
		};

		const res = await (drive.files.create as any)({
			resource: fileMetaData,
			fields: 'id',
		}).catch((err: unknown) => console.log(err));
		arr.shift();
		return res.data.id;
	});
	return id;
};
export const uploadFile = async (
	fileName: string,
	mimeType: string,
	data: any
) => {
	try {
		let fileExt = fileName.split('/');
		let filename = fileExt.pop();

		for (const filext of fileExt) {
			let data = await createFolder(filext, arr);
			arr.push(data);
		}

		await Promise.all(arr).then(async (folder) => {
			const response = await drive.files.create({
				requestBody: {
					name: filename,
					//file name
					parents: folder,
					mimeType: mimeType,
				},
				media: {
					mimeType: mimeType,
					body: data,
				},
			});
			// report the response from the request

			arr = [];
		});
	} catch (error) {
		//report the error message
		console.log(error);
	}
};
