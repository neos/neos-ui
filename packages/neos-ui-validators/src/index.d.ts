// Temporary typings
// TODO: remove when neos-ui-validators converted to TS
declare module '@neos-project/neos-ui-validators' {
    type Validator = (
        values: {},
        elementConfigurations: {}
    ) => null | {} | string;
    interface ValidatorRegistry {
        get: (validatorName: string) => Validator;
    }
    export default function validate (
        values: {},
        elementConfigurations: {},
        validatorRegistry: ValidatorRegistry
    ): null | {} | string;
}
