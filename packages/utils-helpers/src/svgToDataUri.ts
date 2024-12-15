/**
 * Function to convert an SVG content string to a tiny data URI using base64 encoding.
 * @param svgContent
 */
const svgToDataUri = (svgContent: string): string => {
    const base64EncodedSVG = btoa(unescape(encodeURIComponent(svgContent)));
    return `data:image/svg+xml;base64,${base64EncodedSVG}`;
};

export default svgToDataUri;
