/**
 * Creates a curried function which can be used as a `ref` in React Components
 * to focus the rendered node.
 *
 * @param {Boolean} Indicates wether the node should be focused or not,
 */
export const makeFocusNode = isFocused => node => {
    if (node) {
        const method = isFocused ? 'focus' : 'blur';

        node[method]();
    }
};
