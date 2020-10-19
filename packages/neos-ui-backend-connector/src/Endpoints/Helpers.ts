const concatenatePrependAndKey = (prepend?: string, key?: string) => {
    if (prepend) {
        return prepend + '[' + key + ']';
    }
    return key || '';
};

const urlWithParamsInner = (searchParams: {[propName: string]: any}, prepend: string, params: {[propName: string]: any} = {}) => {
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (Array.isArray(value)) {
            value.forEach(v =>
                searchParams.append(concatenatePrependAndKey(prepend, key) + '[]', v)
            );
        } else if (typeof value === 'object') {
            urlWithParamsInner(searchParams, concatenatePrependAndKey(prepend, key), value);
        } else {
            searchParams.append(concatenatePrependAndKey(prepend, key), value);
        }
    });
};

export const searchParams = (params = {}) => {
    const searchParams = new URLSearchParams();
    urlWithParamsInner(searchParams, '', params);
    return searchParams;
};

export const getContextString = (uri: string) => {
    const decodedUri = unescape(uri);
    const uriParts = decodedUri.split('@');
    return uriParts ? uriParts[1].split('.')[0] : '';
};

/**
 * Serializes an object to PHP-compatible URL serialization, with support for nested objects and arrays.
 *
 * @param urlString
 * @param params
 * @return string
 */
export const urlWithParams = (urlString: string, params = {}) => {
    const url = new URL(
        urlString.indexOf(window.location.origin) === 0 ?
            urlString :
            window.location.origin + urlString
    );

    url.search = searchParams(params).toString();

    return url.toString();
};

/**
 * Append params to url without overriding existing params
 *
 * @param urlString
 * @param params
 * @return string
 */
export const urlAppendParams = (urlString: string, params: {[key: string]: string} = {}) => {
    const url = new URL(urlString);
    const searchParams = new URLSearchParams(url.search);
    Object.keys(params).forEach(paramKey => {
        searchParams.set(paramKey, params[paramKey]);
    });
    url.search = searchParams.toString();
    return url.toString();
};

/**
 *
 * @param rootElement
 * @param selector
 * @return string
 */
export const getElementInnerText = (rootElement: HTMLElement, selector: string) => {
    const foundElement = rootElement.querySelector(selector) as HTMLElement;
    if (!foundElement) {
        throw new Error(selector + ' not found in given root element.');
    }

    return foundElement.innerText;
};

/**
 *
 * @param rootElement
 * @param selector
 * @param attributeName
 * @return string
 */
export const getElementAttributeValue = (rootElement: HTMLElement, selector: string, attributeName: string) => {
    const foundElement = rootElement.querySelector(selector) as HTMLElement;
    if (!foundElement) {
        throw new Error(selector + ' not found in given root element.');
    }

    return foundElement.getAttribute(attributeName);
};
