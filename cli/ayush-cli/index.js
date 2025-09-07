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
import chalk from 'chalk';
import boxen from 'boxen';
import logSymbols from 'log-symbols';
import ora from 'ora';
import Table from 'cli-table3';

const { flags, input, showHelp } = cli;
const { clear, debug, logout } = flags;
const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
	if (logout) {
		config.clear();
		console.log(logSymbols.success, chalk.green('You have been logged out.'));
		process.exit(0);
	}

	await init({ clear });
	debug && log(flags);
	input.includes(`help`) && showHelp(0);

	if (input.includes('chat')) {
		let keepChatting = true;
		while (keepChatting) {
			const { symptoms } = await enquirer.prompt({
				type: 'input',
				name: 'symptoms',
				message: `${logSymbols.info} ${chalk.blue('Enter your symptoms:')}`
			});

			const spinner = ora('Generating diagnosis...').start();
			await sleep();
			spinner.stop();

			const table = new Table();
			table.push(
				{ [chalk.green('Diagnosis')]: 'Common Cold' },
				{
					[chalk.green('Recommended Treatment')]:
						'Rest, fluids, and over-the-counter medication.'
				},
				{ [chalk.green('Datasets Used')]: 'NAMASTE, WHO TCM2' }
			);

			const diagnosis = boxen(table.toString(), {
				title: chalk.bold.yellow('Ayush CLI Diagnosis'),
				padding: 1,
				margin: 1,
				borderStyle: 'round'
			});

			console.log(diagnosis);

			const { continueChat } = await enquirer.prompt({
				type: 'confirm',
				name: 'continueChat',
				message: `${logSymbols.info} ${chalk.blue(
					'Do you want to enter more symptoms?'
				)}`
			});
			keepChatting = continueChat;
		}
		console.log(logSymbols.info, chalk.yellow('Exiting chat. Goodbye!'));
	}
})();
