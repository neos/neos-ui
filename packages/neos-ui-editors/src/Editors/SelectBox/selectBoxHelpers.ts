import {I18nRegistry} from '@neos-project/neos-ts-interfaces';
import {isNil} from '@neos-project/utils-helpers';

type RawSelectBoxOptions = {value: string, icon?: string; disabled?: boolean; label: string;}[]|{[key: string]: {icon?: string; disabled?: boolean; label: string;}};

type SelectBoxOptions = {value: string, icon?: string; disabled?: boolean; label: string;}[];

export const shouldDisplaySearchBox = (options: any, processedSelectBoxOptions: SelectBoxOptions) => options.minimumResultsForSearch >= 0 && processedSelectBoxOptions.length >= options.minimumResultsForSearch;

// Currently, we're doing an extremely simple lowercase substring matching; of course this could be improved a lot!
export const searchOptions = (searchTerm: string, processedSelectBoxOptions: SelectBoxOptions) =>
    processedSelectBoxOptions.filter(option => option.label && option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

export const processSelectBoxOptions = (i18nRegistry: I18nRegistry, selectBoxOptions: RawSelectBoxOptions, currentValue: unknown): SelectBoxOptions => {
    const validValues: Record<string, true> = {};
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

    for (const singleValue of Array.isArray(currentValue) ? currentValue : (isNil(currentValue) ? [] : [currentValue])) {
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
