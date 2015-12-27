export default scope => {
    if (!scope['@Neos:Backend']) {
        throw 'Neos Backend could not be found!';
    }

    return scope['@Neos:Backend'];
}
