//
// Turns a given URL string with params into a corresponding URL with PHP-compatible query string
//
export function urlWithParams(urlString: string, params: any = {}): string {
    const queryString = encodeAsQueryString(params);
    if (queryString === '') {
        return urlString;
    }
    const url = new URL(urlString);
    return urlString + (url.search === '' ? '?' : '&') + queryString;
}

export const encodeAsQueryString = (obj: any, prefix: string = ''): string => {
    const str = [];
    let p;
    for (p in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, p)) {
            continue;
        }
        const k = prefix ? prefix + '[' + p + ']' : p;
        const v = obj[p];
        if (v === null) {
            continue;
        }
        str.push((typeof v === 'object') ? encodeAsQueryString(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
    return str.join('&');
};
