#!/usr/bin/env node
/**
 * ayush-cli
 * This Cli uses AyushSync API to connect and App Indian Traditional Medicine and Modern Medicine using FHIR Resources
 *
 * @author Mayank-Jha <https://www.linkedin.com/in/mayankkumarjha07/>
 */

import { run } from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';
import { isLoggedIn, logout } from './utils/auth.js';
import { getCredentials } from './utils/config.js';
import enquirer from 'enquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import logSymbols from 'log-symbols';
import ora from 'ora';
import Table from 'cli-table3';

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const cli = await run();
    const { flags, input, showHelp } = cli;
    const { clear, debug, l } = flags;

    if (l) {
        logout();
        console.log(logSymbols.success, chalk.green('You have been logged out.'));
        process.exit(0);
    }

    await init({ clear });
    debug && log(flags);
    input.includes('help') && showHelp(0);

    if (isLoggedIn()) {
        const { username } = getCredentials();
        console.log(logSymbols.info, chalk.green(`Logged in as: ${username}`));
    }

    if (!isLoggedIn() && !input.includes('login')) {
        console.log(logSymbols.info, chalk.yellow('You are not logged in. Please use the ' + chalk.bold('login') + ' command to authenticate.'));
        showHelp(0);
        process.exit(0);
    } else if (!isLoggedIn() && input.includes('login')) {
        // This case is handled by cli.js, which calls auth.login()
        // We just need to make sure we don't proceed with other commands
        console.log(logSymbols.success, chalk.green('Login process initiated. Please follow the prompts.'));
    } else if (isLoggedIn() && input.length === 0) {
        showHelp(0);
    }

    if (input.includes('chat')) {
        if (!isLoggedIn()) {
            console.log(logSymbols.error, chalk.red('You must be logged in to use the chatbot.'));
            process.exit(1);
        }
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