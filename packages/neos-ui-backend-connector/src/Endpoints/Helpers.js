const concatenatePrependAndKey = (prepend, key) => {
    if (prepend) {
        return prepend + '[' + key + ']';
    }
    return key;
};

const urlWithParamsInner = (searchParams, prepend, params = {}) => {
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (Array.isArray(value)) {
            value.forEach(v =>
                searchParams.append(concatenatePrependAndKey(prepend, key) + '[]', v)
            );
        } else if (typeof value === 'object') {
            urlWithParamsInner(searchParams, concatenatePrependAndKey(prepend, key), value);
        } else {
            searchParams.append(key, value);
        }
    });
};

/**
 * Serializes an object to PHP-compatible URL serialization, with support for nested objects and arrays.
 *
 * @param urlString
 * @param params
 * @return strinf
 */
export const urlWithParams = (urlString, params = {}) => {
    const url = new URL(window.location.origin + urlString);
    const searchParams = new URLSearchParams();

    urlWithParamsInner(searchParams, '', params);

    url.search = searchParams.toString();

    return url.toString();
};

