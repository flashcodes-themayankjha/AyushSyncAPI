import unhandled from 'cli-handle-unhandled';
import { getPackageJson } from 'get-package-json-file';
import config from './config.js';
import enquirer from 'enquirer';
import chalkAnimation from 'chalk-animation';

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

export default async ({ clear = true }) => {
	unhandled();
	const pkgJson = await getPackageJson(`./../package.json`);

	const rainbow = chalkAnimation.rainbow(`
   
    ( A )( Y )( U )( S )( H )(-) ( c )( l )( i )
 

	`);

	await sleep();
	rainbow.stop();

	console.log(`
A AyushSync API
${pkgJson.description}
Version: ${pkgJson.version}
	`);


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
