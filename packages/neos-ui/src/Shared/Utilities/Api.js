/**
 * Returns the API object of the given context, defaults to the `window` object.
 *
 * @param  {Object} The context object, defaults to `window`.
 * @return {Object} The API object you should use within the application.
 */
export const get = (ctx = window) => {
    try {
        return ctx.neos;
    } catch (e) {}

    return {};
};

/**
 * Returns safely the CSRF token from the global neos API.
 *
 * @param  {Object} The context object to be passed to the get() function.
 * @return {String} The CSRF token, if accessible.
 */
export const ERROR_UNABLE_RETRIEVE_CSRF = 'Neos: Unable to retrieve the CSRF token.';
export const getCsrfToken = ctx => {
    try {
        return get(ctx).csrfToken();
    } catch (e) {
        throw new Error(ERROR_UNABLE_RETRIEVE_CSRF);
    }
};
