
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
