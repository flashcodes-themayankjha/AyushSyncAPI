import meow from 'meow';
import meowHelp from 'cli-meow-help';
import { isLoggedIn, login, logout } from './auth.js';

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
    chat: { desc: 'Chat with Ayush CLI' },
    login: { desc: 'Login to Ayush CLI' },
};

const loggedInCommands = {
    help: { desc: 'Print help info' },
    chat: { desc: 'Chat with Ayush CLI' },
    logout: { desc: 'Logout from the CLI' },
};

export const run = async () => {
    const commonOptions = {
        importMeta: import.meta,
        inferType: true,
        description: false,
        hardRejection: false,
        flags
    };

    let cli;
    if (isLoggedIn()) {
        const helpText = meowHelp({
            name: 'ayush-cli',
            flags,
            commands: loggedInCommands
        });
        cli = meow(helpText, commonOptions);
    } else {
        const helpText = meowHelp({
            name: 'ayush-cli',
            flags,
            commands
        });
        cli = meow(helpText, commonOptions);
    }

    if (cli.input.includes('logout') || cli.flags.logout) {
        logout();
        console.log('Logged out successfully.');
        process.exit(0);
    }

    if (cli.input.includes('login')) {
        await login();
    }

    return cli;
};

