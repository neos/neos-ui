/**
 * @TODO I am a cry for help!
 *
 * This is an ad-hoc solution to the problem that properties of a PHP class type
 * (like "Neos\Media\Domain\Model\Tag" for example) may or may not be persisted
 * as object identity DTOs.
 *
 * The function name is intentionally kept vague to allow bugfixes to capture
 * more, potentially obscure cases in which the persisted property value needs
 * to be filtered before the select box receives it.
 *
 * A proper way to handle this would be to define precisely what kind of values
 * the select box editor is going to accept and simply reject everything that
 * violates that definition. Errors would need to be handled in way that
 * indicates to editors that there's a problem that an integrator needs to fix.
 * Furthermore the error handling should make it easy for integrators to figure
 * out what value has been provided to the select box and why it has been
 * rejected.
 *
 * That however would constitute a breaking change and that's how we end up
 * with with this function.
 */
export const createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue = (
    value: unknown
) => {
    if (typeof value === 'object' && value !== null) {
        if (
            '__identity' in value &&
            typeof (value as Record<'__identity', any>).__identity === 'string'
        ) {
            return (value as Record<'__identity', string>).__identity;
        }
    }

    return value;
};
