import isFunction from 'lodash.isfunction';

export const ERROR_INVALID_COMPARATOR = 'Please supply a comparator function as the second argument to the filterDeep function.';

/**
 * Deep filters function for objects and arrays.
 *
 * @param  {Object | Array} arg     The data to filter, can be abselutely anything.
 * @param  {Function} comparator    The test function which gets called for each item, should return a {Boolean}.
 * @return {*}                      The first item which matches the test.
 */
export default function filterDeep(arg, comparator) {
    let result = null;

    if (!comparator || !isFunction(comparator)) {
        throw new Error(ERROR_INVALID_COMPARATOR);
    }

    if (comparator(arg)) {
        return arg;
    } else if (arg.children) {
        return filterDeep(arg.children, comparator);
    } else if (Array.isArray(arg)) {
        arg.forEach(item => {
            if (result === null) {
                result = filterDeep(item, comparator);
            }
        });
    }

    return result;
}
