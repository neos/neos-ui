import urlValidator from './index';

const httpsFormat = /^https?:\/\//;
const httpFormat = /^http?:\/\//;

test('URL without https', () => {
   expect(urlValidator('example.com without https')).toBe(null);
});

test('URL without http', () => {
    expect(urlValidator('example.com without http')).toBe(null);
});

test('URL with https', () => {
    expect(urlValidator('example.com <with>https://')).not.toBe(null);
});

test('URL with http', () => {
    expect(urlValidator('example.com <with>http://')).not.toBe(null);
});
