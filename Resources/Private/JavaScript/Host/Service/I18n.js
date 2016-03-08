function formatIdentifier(identifier) {
    return identifier.replace(/\./g, '_');
}

export default translations =>
    (transUnitId, packageKey = 'TYPO3.Neos', sourceName = 'Main') => {
        if (transUnitId.indexOf(':') !== -1) {
            [packageKey, sourceName, transUnitId] = transUnitId.split(':');
        }

        transUnitId = formatIdentifier(transUnitId);
        packageKey = formatIdentifier(packageKey);
        sourceName = formatIdentifier(sourceName);

        const translation = [packageKey, sourceName, transUnitId].reduce((prev, cur) => prev ? prev[cur] || '' : '', translations);

        if (translation && translation.length) {
            return translation;
        }

        // ToDo: Use the neos logger util.
        console.error(`No translation found for id "${packageKey}:${sourceName}:${transUnitId}" in:`, translations);

        return '';
    };
