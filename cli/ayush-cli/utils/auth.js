import config from './config.js';

export const isLoggedIn = () => {
    const credentials = config.getCredentials();
    return credentials && credentials.username && credentials.password && credentials.apiKey;
};

export const login = async () => {
    // Prompt for username, password, and API key
    // For simplicity, we'll use console prompts here.
    // In a real-world scenario, you might want to use a library like 'inquirer'.
    const username = await prompt('Enter your username: ');
    const password = await prompt('Enter your password: ');
    const apiKey = await prompt('Enter your AyushSync API Code: ');

    config.setCredentials({ username, password, apiKey });
};

export const logout = () => {
    config.clearCredentials();
};

const prompt = (question) => {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        const stdout = process.stdout;

        stdin.resume();
        stdout.write(question);

        stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
};
