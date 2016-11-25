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
            const validationErrors = validationResults.filter(result => result);
            return validationErrors;
        }
    };

    const errors = {};
    Object.keys(values).forEach(elementName => {
        if ((elementName in values) && (elementName in elementConfigurations)) {
            const elementValue = values[elementName];
            const elementConfiguration = elementConfigurations[elementName];
            errors[elementName] = validateElement(elementValue, elementConfiguration);
        }
    });
    return errors;
};

export default validate;
