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
