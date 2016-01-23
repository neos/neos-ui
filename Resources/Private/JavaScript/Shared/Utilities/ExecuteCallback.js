import isFunction from 'lodash.isfunction';

export const ERROR_INVALID_EVENT = 'Please supply a valid native or Synthetic Event to the executeCallback function.';

/**
 * Abstracts the prevent of a DOM event and the existence check for a callback function.
 * @param  {Event}    e                        The event object to handle.
 * @param  {Function} cb                       The callback to call after the event was handled.
 * @param  {Boolean}  preventDefault           Should the function call e.preventDefault();? (Defaults to `true`)
 * @param  {Boolean}  stopImmediatePropagation Should the function call e.stopImmediatePropagation();? (Defaults to `false`)
 *
 * @example <a onClick={e => executeCallback(e, this.props.onClick)}>Click me</a>
 */
export default ({e, cb, preventDefault = true, stopImmediatePropagation = false} = {}) => {
    //
    // Check for the validaty of the event object, if one was passed.
    //
    if (e && !e.preventDefault) {
        throw new Error(ERROR_INVALID_EVENT);
    }

    if (e && preventDefault) {
        e.preventDefault();
    }

    if (e && stopImmediatePropagation) {
        //
        // Since react bubbles SyntheticEvents instead of native DOM events,
        // we need to handle both cases appropriately.
        //
        // @see https://facebook.github.io/react/docs/events.html#syntheticevent
        //
        try {
            e.stopImmediatePropagation();
        } catch (e) {}
        try {
            e.stopPropagation();
        } catch (e) {}
    }

    if (cb && isFunction(cb)) {
        cb(e);
    }
};
