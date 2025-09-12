let _isTestMode = false;

export const setTestMode = (value) => {
    _isTestMode = value;
};

export const getTestMode = () => {
    return _isTestMode;
};