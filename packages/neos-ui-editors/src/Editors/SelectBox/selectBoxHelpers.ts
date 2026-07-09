import type {I18nRegistry} from '@neos-project/neos-ui-i18n';
import {isNil} from '@neos-project/utils-helpers';
import {translate} from '@neos-project/neos-ui-i18n';
import {
    createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue
} from './createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue';

type SerializedEntity = {
    __identity: string;
    [key: string]: string;
}

type RawSelectBoxOptions = {
        value: string | SerializedEntity,
        icon?: string;
        disabled?: boolean;
        label: string;
        group?: string;
    }[] |
    {
        [key: string]: {
            icon?: string;
            disabled?: boolean;
            label: string;
            group?: string;
        } | null | Record<string, any>;
    };

type SelectBoxOption = {
    value: string,
    icon?: string;
    disabled?: boolean;
    label: string;
    group?: string;
}

type SelectBoxOptions = SelectBoxOption[];

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
        const processedSelectBoxOption: SelectBoxOption = {
            value: key,
            ...selectBoxOption, // a value in here overrules value based on the key above.
            label: i18nRegistry.translate(selectBoxOption.label, '')
        };
        processedSelectBoxOption.value = createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue(processedSelectBoxOption.value) as string;

        if (selectBoxOption.group) {
            processedSelectBoxOption.group = i18nRegistry.translate(selectBoxOption.group);
        }

        validValues[processedSelectBoxOption.value] = true;
        processedSelectBoxOptions.push(processedSelectBoxOption);
    }

    const valueIsEmpty = isNil(currentValue) || currentValue === '';
    if (valueIsEmpty) {
        return processedSelectBoxOptions;
    }

    for (const singleValue of Array.isArray(currentValue) ? currentValue : [currentValue]) {
        if (singleValue in validValues) {
            continue;
        }

        // Mismatch detected. Thus we add an option to the schema so the value is displayable: https://github.com/neos/neos-ui/issues/3520
        processedSelectBoxOptions.push({
            value: singleValue,
            label: `${translate('Neos.Neos.Ui:Main:invalidValue', 'Invalid value')}: "${singleValue}"`,
            icon: 'exclamation-triangle'
        });
    }

    return processedSelectBoxOptions;
}
