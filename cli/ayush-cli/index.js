#!/usr/bin/env node

/**
 * ayush-cli
 * This Cli uses AyushSync API to connect and App Indian Traditional Medicine and Modern Medicine using FHIR Resources
 *
 * @author Mayank-Jha <https://www.linkedin.com/in/mayankkumarjha07/>
 */

import cli from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';
import config from './utils/config.js';
import enquirer from 'enquirer';

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

(async () => {
	await init({ clear });
	debug && log(flags);
	input.includes(`help`) && showHelp(0);

	let username = config.get('username');
	let password = config.get('password');
	let apiKey = config.get('apiKey');

	if (!username || !password || !apiKey) {
		const response = await enquirer.prompt([
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
		]);

		config.set('username', response.username);
		config.set('password', response.password);
		config.set('apiKey', response.apiKey);
	}
})();