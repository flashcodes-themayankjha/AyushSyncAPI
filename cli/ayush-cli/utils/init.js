import unhandled from 'cli-handle-unhandled';
import welcome from 'cli-welcome';
import { getPackageJson } from 'get-package-json-file';
import config from './config.js';
import enquirer from 'enquirer';

export default async ({ clear = true }) => {
	unhandled();
	const pkgJson = await getPackageJson(`./../package.json`);

	welcome({
		title: `ayush-cli`,
		tagLine: `A AyushSync API`,
		description: pkgJson.description,
		version: pkgJson.version,
		bgColor: '#A699EA',
		color: '#000000',
		bold: true,
		clear
	});

	let username = config.get('username');
	let password = config.get('password');
	let ayushSyncAPICode = config.get('ayushSyncAPICode');

	if (!username || !password || !ayushSyncAPICode) {
		const questions = [
			{
				type: 'input',
				name: 'username',
				message: 'Enter your username'
			},
			{
				type: 'password',
				name: 'password',
				message: 'Enter your password'
			},
			{
				type: 'input',
				name: 'ayushSyncAPICode',
				message: 'Enter your AyushSync API Code'
			}
		];
		const answers = await enquirer.prompt(questions);
		config.set('username', answers.username);
		config.set('password', answers.password);
		config.set('ayushSyncAPICode', answers.ayushSyncAPICode);
	}
};
