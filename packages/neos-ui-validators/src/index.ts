import {$get} from 'plow-js';
import {ValidatorRegistry, PropertyConfiguration, ValidatorConfiguration} from '@neos-project/neos-ts-interfaces';
/**
 * Takes object of values and their configuration, and returns either null
 * or object filled with validation erros per element.
 *
 * @param object values. Elements' values
 * @param object elementConfigurations. Elements' configuration
 * @param object validatorRegistry. Validator registry
 * @return object or null
 */
interface ValuesMap {
    [itemProp: string]: any;
}
interface ErrorsMap {
    [itemProp: string]: any;
}
interface ElementConfiguarionsMap {
    [itemProp: string]: PropertyConfiguration | undefined;
}
// TODO: typing could be greatly improved. E.g. we could gather all possible options interfaces and make a discriminated union out of them
const validate = (values: ValuesMap, elementConfigurations: ElementConfiguarionsMap, validatorRegistry: ValidatorRegistry) => {
    const checkValidator = (elementValue: any, validatorName: string, validatorConfiguration: ValidatorConfiguration) => {
        const validator = validatorRegistry.get(validatorName);
        if (validator) {
            return validator(elementValue, validatorConfiguration);
        }
        console.warn(`Validator ${validatorName} not found`); // tslint:disable-line no-console
        return null;
    };

    const validateElement = (elementValue: any, elementConfiguration: PropertyConfiguration | undefined) => {
        if (elementConfiguration && elementConfiguration.validation) {
            const validators = elementConfiguration.validation;
            const validationResults = Object.keys(validators).map(validatorName => {
                const validatorConfiguration = validators[validatorName];
                if (!validatorConfiguration) {
                    throw new Error('Dummy TypeScript type guard, will never be thrown');
                }
                return checkValidator(elementValue, validatorName, validatorConfiguration);
            });
            return validationResults.filter(result => result);
        }
        return null;
    };

    const errors: ErrorsMap = {};
    let hasErrors = false;
    Object.keys(elementConfigurations).forEach(elementName => {
        const elementValue = $get([elementName], values);
        const elementConfiguration = elementConfigurations[elementName];
        const elementErrors = validateElement(elementValue, elementConfiguration);
        if (elementErrors && elementErrors.length > 0) {
            hasErrors = true;
            errors[elementName] = elementErrors;
        }
    });
    return hasErrors ? errors : null;
};

export default validate;
