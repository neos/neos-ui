const REGEX = {
    whitespace: /\s+/g,
    urlHexPairs: /%[\dA-F]{2}/g,
    quotes: /"/g
};

// Function to collapse whitespace in a string
const collapseWhitespace = (str: string): string =>
    str.trim().replace(REGEX.whitespace, ' ');

// Function to encode data for a URI payload
const dataURIPayload = (string: string): string =>
    encodeURIComponent(string).replace(REGEX.urlHexPairs, specialHexEncode);

// Function to handle special hex encoding
const specialHexEncode = (match: string): string => {
    switch (match) {
        case '%20':
            return ' ';
        case '%3D':
            return '=';
        case '%3A':
            return ':';
        case '%2F':
            return '/';
        default:
            return match.toLowerCase(); // Compresses better
    }
};

// Function to convert an SVG string to a tiny data URI
const svgToDataUri = (svgString: string): string => {
    // Strip the Byte-Order Mark if the SVG has one
    if (svgString.charCodeAt(0) === 0xfeff) {
        svgString = svgString.slice(1);
    }

    const body = collapseWhitespace(svgString);
    return `data:image/svg+xml,${dataURIPayload(body)}`;
};

// Add a static method to handle srcset conversions
svgToDataUri.toSrcset = (svgString: string): string =>
    svgToDataUri(svgString).replace(/ /g, '%20');

// Export the function as the default export
export default svgToDataUri;
