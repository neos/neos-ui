import isObject from 'lodash.isobject';
import isFunction from 'lodash.isfunction';

/**
 * Abstracts the prevent of a DOM event and the existence check for a callback function.
 *
 * @param  {Array} ...args  All arguments which are passed to the function.
 * @return {Null}
 * @example <a onClick={e => executeCallback(e, this.props.onClick)}>Click me</a>
 */
const executeCallback = (...args) => {
    let e;

    args.forEach(arg => {
        if (isObject(arg) && isFunction(arg.preventDefault)) {
            e = arg;
            e.preventDefault();
        } else if (isFunction(arg)) {
            arg(e);
        }
    });
};

export default executeCallback;
