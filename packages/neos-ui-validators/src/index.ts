import {$get} from 'plow-js';
import {ValidatorRegistry, PropertyConfiguration, ValidatorConfiguration} from '@neos-project/neos-ts-interfaces';

interface ValuesMap {
    [itemProp: string]: any;
}
interface ErrorsMap {
    [itemProp: string]: any;
}
interface ElementConfiguarionsMap {
    [itemProp: string]: PropertyConfiguration | undefined;
}

/**
 * Takes a single value and its configuration, and returns either null
 * or an array of validation errors.
 */
export const validateElement = (elementValue: any, elementConfiguration: PropertyConfiguration | undefined, validatorRegistry: ValidatorRegistry) => {
    const checkValidator = (elementValue: any, validatorName: string, validatorConfiguration: ValidatorConfiguration | undefined) => {
        const validator = validatorRegistry.get(validatorName);
        if (validator) {
            return validator(elementValue, validatorConfiguration);
        }
        console.warn(`Validator ${validatorName} not found`); // tslint:disable-line no-console
        return null;
    };

    if (elementConfiguration && elementConfiguration.validation) {
        const validators = elementConfiguration.validation;
        const validationResults = Object.keys(validators).map(validatorName => {
            const validatorConfiguration = validators[validatorName];
            return checkValidator(elementValue, validatorName, validatorConfiguration);
        }).filter(result => result);
        return validationResults.length === 0 ? null : validationResults;
    }
    return null;
};

/**
 * Takes object of values and their configuration, and returns either null
 * or object filled with validation erros per element.
 *
 * @param object values. Elements' values
 * @param object elementConfigurations. Elements' configuration
 * @param object validatorRegistry. Validator registry
 * @return object or null
 */
// TODO: typing could be greatly improved. E.g. we could gather all possible options interfaces and make a discriminated union out of them
const validate = (values: ValuesMap, elementConfigurations: ElementConfiguarionsMap, validatorRegistry: ValidatorRegistry) => {
    const errors: ErrorsMap = {};
    let hasErrors = false;
    Object.keys(elementConfigurations).forEach(elementName => {
        const elementValue = $get([elementName], values);
        const elementConfiguration = elementConfigurations[elementName];
        const elementErrors = validateElement(elementValue, elementConfiguration, validatorRegistry);
        if (elementErrors && elementErrors.length > 0) {
            hasErrors = true;
            errors[elementName] = elementErrors;
        }
    });
    return hasErrors ? errors : null;
};

export default validate;
