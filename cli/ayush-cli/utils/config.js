
import Conf from 'conf';

const config = new Conf({ projectName: 'ayush-cli' });

export const getCredentials = () => {
    return config.get('credentials');
};

export const setCredentials = (credentials) => {
    config.set('credentials', credentials);
};

export const clearCredentials = () => {
    config.delete('credentials');
};

export default { getCredentials, setCredentials, clearCredentials };

