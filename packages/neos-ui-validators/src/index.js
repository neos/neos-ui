/**
 * Takes object of values and their configuration, and returns either null
 * or object filled with validation erros per element.
 *
 * @param object values. Elements' values
 * @param object elementConfigurations. Elements' configuration
 * @param object validatorRegistry. Validator registry
 * @return object or null
 */
const validate = (values, elementConfigurations, validatorRegistry) => {
    const checkValidator = (elementValue, validatorName, validatorConfiguration) => {
        const validator = validatorRegistry.get(validatorName);
        if (validator) {
            return validator(elementValue, validatorConfiguration);
        }
        console.error(`Validator ${validatorName} not found`);
    };

    const validateElement = (elementValue, elementConfiguration) => {
        const validators = elementConfiguration.validation;
        if (validators) {
            const validationResults = Object.keys(validators).map(validatorName => {
                const validatorConfiguration = validators[validatorName];
                return checkValidator(elementValue, validatorName, validatorConfiguration);
            });
            return validationResults.filter(result => result);
        }
    };

    const errors = {};
    let hasErrors = false;
    Object.keys(values).forEach(elementName => {
        if ((elementName in values) && (elementName in elementConfigurations)) {
            const elementValue = values[elementName];
            const elementConfiguration = elementConfigurations[elementName];
            const elementErrors = validateElement(elementValue, elementConfiguration);
            if (elementErrors.length > 0) {
                hasErrors = true;
                errors[elementName] = elementErrors;
            }
        }
    });
    return hasErrors ? errors : null;
};

export default validate;
