export const shouldDisplaySearchBox = (options, processedSelectBoxOptions) => options.minimumResultsForSearch >= 0 && processedSelectBoxOptions.length >= options.minimumResultsForSearch;

// Currently, we're doing an extremely simple lowercase substring matching; of course this could be improved a lot!
export const searchOptions = (searchTerm, processedSelectBoxOptions) =>
    processedSelectBoxOptions.filter(option => option.label && option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

export const processSelectBoxOptions = (i18nRegistry, selectBoxOptions, currentValue) => {
    const validValues = {};
    const processedSelectBoxOptions = [];
    for (const [key, selectBoxOption] of Object.entries(selectBoxOptions)) {
        if (!selectBoxOption || !selectBoxOption.label) {
            continue;
        }

        const processedSelectBoxOption = {
            value: key,
            ...selectBoxOption, // a value in here overrules value based on the key above.
            label: i18nRegistry.translate(selectBoxOption.label)
        };

        validValues[processedSelectBoxOption.value] = true;
        processedSelectBoxOptions.push(processedSelectBoxOption);
    }

    for (const singleValue of Array.isArray(currentValue) ? currentValue : (currentValue === undefined ? [] : [currentValue])) {
        if (singleValue in validValues) {
            continue;
        }

        // Mismatch detected. Thus we add an option to the schema so the value is displayable: https://github.com/neos/neos-ui/issues/3520
        processedSelectBoxOptions.push({
            value: singleValue,
            label: `${i18nRegistry.translate('Neos.Neos.Ui:Main:invalidValue')}: "${singleValue}"`,
            icon: 'exclamation-triangle'
        });
    }

    return processedSelectBoxOptions;
}
