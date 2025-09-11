import config from './config.js';
import axios from 'axios';
import readline from 'readline';


const API_URL = 'https://ayushsync.onrender.com/api/v1/user';

export const isLoggedIn = () => {
    const token = config.getToken();
    return !!token;
};

export const login = async () => {
    if (process.env.TEST_MODE === 'true') {
        const ayushId = await prompt('Enter your AyushID: ');
        const otp = await prompt('Enter the OTP: ');
        if (ayushId === '1234567890' && otp === '123456') {
            config.setToken('test-token');
            console.log('Logged in successfully (test mode).');
        } else {
            console.error('Invalid AyushID or OTP for test mode.');
        }
        return;
    }

    const ayushId = await prompt('Enter your AyushID: ');

    try {
        await axios.post(`${API_URL}/send-otp`, { ayushId });
        console.log('OTP sent to your registered mobile number.');
    } catch (error) {
        console.error('Error sending OTP:', error.response ? error.response.data : error.message);
        return;
    }

    const otp = await prompt('Enter the OTP: ');

    try {
        const response = await axios.post(`${API_URL}/verify-otp`, { ayushId, otp });
        const { token } = response.data;
        config.setToken(token);
        console.log('Logged in successfully.');
    } catch (error) {
        console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
    }
};

export const logout = () => {
    config.clearToken();
};



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