
import Conf from 'conf';

const config = new Conf({ projectName: 'ayush-cli' });

export const getToken = () => {
    return config.get('token');
};

export const setToken = (token) => {
    config.set('token', token);
};

export const clearToken = () => {
    config.delete('token');
};

export default { getToken, setToken, clearToken };

