export default scope => {
    if (!scope['@Neos:Backend']) {
        throw new Error('Neos Backend could not be found!');
    }

    return scope['@Neos:Backend'];
};
