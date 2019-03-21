const generateRandom = (length: number) => {
    return Math.random().toString(36).substring(2, length) + Math.random().toString(36).substring(2, length);
};

/**
 * Append a random string to the given value.
 * Only empty strings will not get the random suffix.
 *
 * @param {string} value
 * @return {string}
 */
const randomizeString = (value: string) => {
    return value === '' ? value : value + '-' + generateRandom(5);
};

export {randomizeString};
