import config from './config.js';
import axios from 'axios';
import readline from 'readline';
import ora from 'ora';
import chalk from 'chalk';
import logSymbols from 'log-symbols';

const AYUSH_AUTH_BASE_URL = 'https://ayush-auth.vercel.app';

const prompt = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
};

export const isLoggedIn = () => {
    const token = config.getToken();
    return !!token;
};

export const login = async () => {
    console.log('    '); // Padding
    const abha_id = await prompt('    ' + chalk.blue.bold('Enter your ABHA ID: '));
    console.log('    '); // Padding

    const otpSpinner = ora(chalk.yellow('Sending OTP...')).start();
    try {
        await axios.post(`${AYUSH_AUTH_BASE_URL}/request-login-otp?abha_id=${abha_id}`);
        otpSpinner.stopAndPersist({
            symbol: logSymbols.success,
            text: chalk.green.bold('Login OTP sent to your registered mobile number.')
        });
    } catch (error) {
        otpSpinner.stopAndPersist({
            symbol: logSymbols.error,
            text: chalk.red.bold('Error requesting login OTP:') + (error.response ? chalk.red(` ${error.response.data.detail || error.response.statusText}`) : chalk.red(` ${error.message}`))
        });
        console.log('    '); // Padding
        return false;
    }

    console.log('    '); // Padding
    const otp = await prompt(chalk.blue.bold('Enter the OTP: '));
    console.log('    '); // Padding

    const loginSpinner = ora(chalk.yellow('Authenticating...')).start();
    try {
        const response = await axios.post(`${AYUSH_AUTH_BASE_URL}/token?abha_id=${abha_id}&otp=${otp}`);
        const { access_token } = response.data;
        config.setToken(access_token);
        loginSpinner.stopAndPersist({
            symbol: logSymbols.success,
            text: chalk.green.bold('Logged in successfully.')
        });
        console.log('    '); // Padding
        return true;
    } catch (error) {
        loginSpinner.stopAndPersist({
            symbol: logSymbols.error,
            text: chalk.red.bold('Error logging in:') + (error.response ? chalk.red(` ${error.response.data.detail || error.response.statusText}`) : chalk.red(` ${error.message}`))
        });
        console.log('    '); // Padding
        return false;
    }
};

export const register = async () => {
    console.log('    '); // Padding
    const name = await prompt(chalk.blue.bold('Enter your Name: '));
    console.log('    '); // Padding
    const phone_number = await prompt(chalk.blue.bold('Enter your Phone Number (10 digits): '));
    console.log('    '); // Padding
    const abha_id = await prompt(chalk.blue.bold('Enter your ABHA ID: '));
    console.log('    '); // Padding
    const email = await prompt(chalk.blue.bold('Enter your Email: '));
    console.log('    '); // Padding

    const otpSpinner = ora(chalk.yellow('Requesting registration OTP...')).start();
    try {
        await axios.post(`${AYUSH_AUTH_BASE_URL}/request-otp`, {
            name,
            phone_number,
            abha_id,
            email
        });
        otpSpinner.stopAndPersist({
            symbol: logSymbols.success,
            text: chalk.green.bold('Registration OTP sent to your phone number.')
        });
    } catch (error) {
        otpSpinner.stopAndPersist({
            symbol: logSymbols.error,
            text: chalk.red.bold('Error requesting registration OTP:') + (error.response ? chalk.red(` ${error.response.data.detail || error.response.statusText}`) : chalk.red(` ${error.message}`))
        });
        console.log('    '); // Padding
        return false;
    }

    console.log('    '); // Padding
    const otp = await prompt(chalk.blue.bold('Enter the OTP: '));
    console.log('    '); // Padding

    const registerSpinner = ora(chalk.yellow('Registering user...')).start();
    try {
        await axios.post(`${AYUSH_AUTH_BASE_URL}/register?abha_id=${abha_id}&otp=${otp}`);
        registerSpinner.stopAndPersist({
            symbol: logSymbols.success,
            text: chalk.green.bold('User registered successfully. Please log in.')
        });
        console.log('    '); // Padding
        return true;
    } catch (error) {
        registerSpinner.stopAndPersist({
            symbol: logSymbols.error,
            text: chalk.red.bold('Error registering user:') + (error.response ? chalk.red(` ${error.response.data.detail || error.response.statusText}`) : chalk.red(` ${error.message}`))
        });
        console.log('    '); // Padding
        return false;
    }
};

export const logout = () => {
    config.clearToken();
    console.log('Logged out successfully.');
};

export const getAuthHeader = () => {
    const token = config.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
