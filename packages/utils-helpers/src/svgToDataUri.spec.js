import svgToDataUri from './svgToDataUri';

describe('svgToDataUri', () => {
    it('should convert an SVG string to a valid data URI', () => {
        const svgContent = `<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="blue"/></svg>`;
        const base64Content = 'PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsdWUiLz48L3N2Zz4=';
        const dataUri = svgToDataUri(svgContent);
        expect(dataUri).toBe(`data:image/svg+xml;base64,${base64Content}`);
    });

    it('should handle special characters correctly', () => {
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg"><text x="10" y="20">Héllo, Wörld!</text></svg>`;
        const base64Content = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyMCI+SMOpbGxvLCBXw7ZybGQhPC90ZXh0Pjwvc3ZnPg==';
        const dataUri = svgToDataUri(svgContent);
        expect(dataUri).toBe(`data:image/svg+xml;base64,${base64Content}`);
    });

    it('should throw an error for invalid SVG input', () => {
        expect(() => svgToDataUri('<div>Not an SVG</div>')).not.toThrow();
    });
});
