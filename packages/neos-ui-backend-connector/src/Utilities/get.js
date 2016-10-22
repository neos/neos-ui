/**
 * Returns the API object of the given context, defaults to the `window` object.
 *
 * @param  {Object} The context object, defaults to `window`.
 * @return {Object} The API object you should use within the application.
 */
export const get = (ctx = window) => {
    try {
        return ctx.neos || {};
    } catch (e) {}

    return {};
};
