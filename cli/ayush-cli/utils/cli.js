import meowHelp from 'cli-meow-help';
import meow from 'meow';

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		shortFlag: `c`,
		desc: `Clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		shortFlag: `d`,
		desc: `Print debug info`
	},
	logout: {
		type: `boolean`,
		default: false,
		desc: `Logout from the CLI`
	}
};

const commands = {
	help: { desc: `Print help info` },
	chat: { desc: `Chat with Ayush CLI` }
};

const helpText = meowHelp({
	name: `calai`,
	flags,
	commands
});

const options = {
	importMeta: import.meta,
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options);
