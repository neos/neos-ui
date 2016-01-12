/**
 * Deep filters function for objects and arrays.
 *
 * @param  {Object | Array} arg The data to filter, can be abselutely anything.
 * @param  {Function} cb    The test function which gets called for each item, should return a {Boolean}.
 * @return {*}              The first item which matches the test.
 */
export default function filterDeep(arg, cb) {
    let result = null;

    if (cb(arg)) {
        return arg;
    } else if (arg.children) {
        return filterDeep(arg.children, cb);
    } else if (Array.isArray(arg)) {
        arg.forEach(item => {
            if (result === null) {
                result = filterDeep(item, cb);
            }
        });
    }

    return result;
}
