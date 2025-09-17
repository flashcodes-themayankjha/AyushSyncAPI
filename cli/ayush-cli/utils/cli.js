#!/usr/bin/env node
import meow from 'meow';
import meowHelp from 'cli-meow-help';
import unhandled from 'cli-handle-unhandled';
import { getPackageJson } from 'get-package-json-file';
import { isLoggedIn, login, logout } from './auth.js';

import { setTestMode, getTestMode } from './testModeManager.js';
import enquirer from 'enquirer';
import chalkAnimation from 'chalk-animation';
import boxen from 'boxen';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';
import open from 'open';

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

const { prompt } = enquirer;

const flags = {
    clear: {
        type: 'boolean',
        default: false,
        shortFlag: 'c',
        desc: 'Clear the console'
    },
    debug: {
        type: 'boolean',
        default: false,
        shortFlag: 'd',
        desc: 'Print debug info'
    },
    logout: {
        type: 'boolean',
        default: false,
        shortFlag: 'l',
        desc: 'Logout from the CLI'
    },
    quit: {
        type: 'boolean',
        default: false,
        shortFlag: 'q',
        desc: 'Quit the CLI'
    },
    testMode: {
        type: 'boolean',
        default: false,
        shortFlag: 't',
        desc: 'Enable test mode '
    }
};

const commands = {
    help: { desc: 'Print help info' },
    login: { desc: 'Login to Ayush CLI' },
    clear: { desc: 'Clear the console' },
};

const loggedInCommands = {
    help: { desc: 'Print help info' },
    chat: { desc: 'Chat with Ayush CLI' },
    translate: { desc: 'Translate ICD-11 to NAMASTE or vice versa' },
    logout: { desc: 'Logout from the CLI' },
    clear: { desc: 'Clear the console' },
};

export const getCli = (loggedIn) => {
    const commonOptions = {
        importMeta: import.meta,
        inferType: true,
        description: false,
        hardRejection: false,
        flags
    };
    const helpText = meowHelp({
        name: 'ayush-cli',
        flags,
        commands: loggedIn ? loggedInCommands : commands
    });
    return meow(helpText, commonOptions);
}

export const run = async () => {
    unhandled();
    
    let cli = getCli(isLoggedIn() || getTestMode());

    if (cli.flags.logout) {
        logout();
        console.log('    Logged out successfully.');
        return null; // exit
    }

    if (cli.input.length === 0) {
        const rainbow = chalkAnimation.rainbow(`
	 █████╗ ██╗   ██╗██╗   ██╗███████╗██╗  ██╗       ██████╗██╗     ██╗
	██╔══██╗╚██╗ ██╔╝██║   ██║██╔════╝██║  ██║      ██╔════╝██║     ██║
	███████║ ╚████╔╝ ██║   ██║███████╗███████║█████╗██║     ██║     ██║
	██╔══██║  ╚██╔╝  ██║   ██║╚════██║██╔══██║╚════╝██║     ██║     ██║
	██║  ██║   ██║   ╚██████╔╝███████║██║  ██║      ╚██████╗███████╗██║
	╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝       ╚══════╝╚══════╝╚═╝
	`);

	    await sleep();
	    rainbow.stop();

        const pkgJson = await getPackageJson('../package.json');
        const welcomeMessage = `${chalk.blue.bold('Welcome to Ayush CLI!')} ${chalk.magenta.bold(`v${pkgJson.version}`)}

${chalk.dim(pkgJson.description)}`;
        const header = boxen(welcomeMessage, {
            padding: 1,
            margin: { top: 1, bottom: 1, left: 2, right: 2 },
            borderStyle: 'round',
            borderColor: 'green',
            title: chalk.bold.yellow('Ayush CLI'),
            titleAlignment: 'center',
            width: 80
        });
        console.log(header);

        // Only show authentication prompt if not logged in and not in test mode
        if (!isLoggedIn() && !getTestMode()) {
            const boxedMessage = boxen(chalk.yellow.bold('Login to Continue'), {
                padding: 1,
                margin: { top: 1, bottom: 1, left: 2, right: 2 },
                borderStyle: 'round',
                borderColor: 'green',
                title: chalk.bold.yellow('Authentication'),
                titleAlignment: 'center',
                width: 80
            });
            console.log(boxedMessage);

            const response = await prompt({
                type: 'select',
                name: 'action',
                message: ' ',
                prefix: '  ',
                choices: [
                    { name: 'login', message: 'Login' },
                    { name: 'signup', message: 'Sign Up' },
                    { name: 'guest', message: 'Continue as Guest' },
                    { name: 'testMode', message: 'Enter Test Mode ' }
                ]
            });

            switch (response.action) {
                case 'login':
                    await login();
                    break;
                case 'signup':
                    open('https://ayush-sync-web.vercel.app/');
                    console.log('    Please sign up on the website and then login.');
                    return null;
                case 'guest':
                    console.log('    Most features will be locked.');
                    return null;
                case 'testMode':
                    setTestMode(true);

                    const modeText = '  ⚙️Tester Mode  ';
                    const coloredModeText = chalk.bgYellow.black(modeText);
                    const visibleLength = stripAnsi(coloredModeText).length;
                    const terminalWidth = process.stdout.columns || 80;
                    const padding = terminalWidth - visibleLength;
                    const paddedText = coloredModeText + ' '.repeat(padding);

                    console.log(paddedText);

                    // Confirmation Message Box (centered)
                    const confirmationMessage = 'Entered Test Mode. All features are accessible.';
                    const confirmationBox = boxen(chalk.bold(confirmationMessage), {
                        padding: 1,
                        margin: { top: 1, bottom: 1, left: 2, right: 2 },
                        borderStyle: 'round',
                        borderColor: 'green',
                        title: chalk.bold.yellow('Test Mode Activated'),
                        titleAlignment: 'center',
                        width: 80 // Same width as other main boxes
                    });
                    console.log(confirmationBox);
                    break;
            }
        }
    }
    
    return getCli(isLoggedIn() || getTestMode());
};
