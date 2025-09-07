import unhandled from 'cli-handle-unhandled';
import { getPackageJson } from 'get-package-json-file';
import { getCredentials, setCredentials } from './config.js';
import enquirer from 'enquirer';
import chalkAnimation from 'chalk-animation';

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

export default async ({ clear = true }) => {
	unhandled();
	const pkgJson = await getPackageJson(`./../package.json`);

	const rainbow = chalkAnimation.rainbow(`
	 █████╗ ██╗   ██╗██╗   ██╗███████╗██╗  ██╗       ██████╗██╗     ██╗
	██╔══██╗╚██╗ ██╔╝██║   ██║██╔════╝██║  ██║      ██╔════╝██║     ██║
	███████║ ╚████╔╝ ██║   ██║███████╗███████║█████╗██║     ██║     ██║
	██╔══██║  ╚██╔╝  ██║   ██║╚════██║██╔══██║╚════╝██║     ██║     ██║
	██║  ██║   ██║   ╚██████╔╝███████║██║  ██║      ╚██████╗███████╗██║
	╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝       ╚═════╝╚══════╝╚═╝
	`);

	await sleep();
	rainbow.stop();

	console.log(`
A AyushSync API
${pkgJson.description}
Version: ${pkgJson.version}
	`);


	let { username, password, apiKey } = getCredentials() || {};

	if (!username || !password || !apiKey) {
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
				name: 'apiKey',
				message: 'Enter your AyushSync API Code'
			}
		];
		const answers = await enquirer.prompt(questions);
		setCredentials({ username: answers.username, password: answers.password, apiKey: answers.apiKey });
	}
};
