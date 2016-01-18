function formatIdentifier(identifier) {
    return identifier.replace('.', '_');
}

export default translations =>
    (transUnitId, packageKey = 'TYPO3.Neos', sourceName = 'Main') => {
        transUnitId = formatIdentifier(transUnitId);
        packageKey = formatIdentifier(packageKey);
        sourceName = formatIdentifier(sourceName);

        const translation = [packageKey, sourceName, transUnitId].reduce((prev, cur) => prev ? prev[cur] || '' : '', translations);

        if (translation && translation.length) {
            return translation;
        }

        // ToDo: Use the neos logger util.
        console.error(`No translation found for id "${transUnitId}" in:`, translations);
    };
