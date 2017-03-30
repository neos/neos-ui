import textValidator from './index';

test('text without xml tags should be valid', () => {
    expect(textValidator('someTextWithoutXMLTags')).toBe(null);
});

test('text with xml tags should not be valid', () => {
    expect(textValidator('someText<with>XMLTags')).not.toBe(null);
});

test('empty value should be valid', () => {
    expect(textValidator('')).toBe(null);
});
