
import meow from 'meow';
import meowHelp from 'cli-meow-help';
import unhandled from 'cli-handle-unhandled';
import { getPackageJson } from 'get-package-json-file';
import { isLoggedIn, login, logout } from './auth.js';
import enquirer from 'enquirer';
import chalkAnimation from 'chalk-animation';

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));
const { prompt } = enquirer;
import open from 'open';

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
    }
};

const commands = {
    help: { desc: 'Print help info' },
    login: { desc: 'Login to Ayush CLI' },
};

const loggedInCommands = {
    help: { desc: 'Print help info' },
    chat: { desc: 'Chat with Ayush CLI' },
    translate: { desc: 'Translate ICD-11 to NAMASTE or vice versa' },
    logout: { desc: 'Logout from the CLI' },
};





const getCli = (loggedIn) => {
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
    const pkgJson = await getPackageJson(`./../package.json`);
    let cli = getCli(isLoggedIn());

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

    

    if (!isLoggedIn() && cli.input.length === 0) {
        const response = await prompt({
            type: 'select',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: 'login', message: 'Login' },
                { name: 'signup', message: 'Sign Up' },
                { name: 'guest', message: 'Continue as Guest' }
            ]
        });

        switch (response.action) {
            case 'login':
                await login();
                if(isLoggedIn()){
                    cli = getCli(true);
                }
                break;
            case 'signup':
                open('https://ayushlink.netlify.app/');
                console.log('Please sign up on the website and then login.');
                process.exit(0);
            case 'guest':
                console.log('Most features will be locked.');
                return null;
        }
    }

    if (cli && (cli.input.includes('logout') || cli.flags.logout)) {
        logout();
        console.log('Logged out successfully.');
        process.exit(0);
    }

    if (cli && cli.input.includes('login')) {
        await login();
        if(isLoggedIn()){
            cli = getCli(true);
        }
    }

    if (cli && cli.input.includes('chat') && !isLoggedIn()) {
        console.log('You need to be logged in to use the chat feature.');
        process.exit(0);
    }


    return cli;
};
