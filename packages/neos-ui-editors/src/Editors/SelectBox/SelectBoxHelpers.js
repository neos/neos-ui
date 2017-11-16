export const shouldDisplaySearchBox = (options, processedSelectBoxOptions) => options.minimumResultsForSearch >= 0 && processedSelectBoxOptions.length >= options.minimumResultsForSearch;

// Currently, we're doing an extremely simple lowercase substring matching; of course this could be improved a lot!
export const searchOptions = (searchTerm, processedSelectBoxOptions) =>
    processedSelectBoxOptions.filter(option => option.label && option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

export const processSelectBoxOptions = (i18nRegistry, selectBoxOptions) =>
    // ToDo: Can't we optimize this by using Object.values and one instead of two filter statements instead?
    Object.keys(selectBoxOptions)
        .filter(k => selectBoxOptions[k])
        // Filter out items without a label
        .map(k => selectBoxOptions[k].label && Object.assign(
            {value: k},
            selectBoxOptions[k],
            {label: i18nRegistry.translate(selectBoxOptions[k].label)}
        ))
        .filter(k => k);
