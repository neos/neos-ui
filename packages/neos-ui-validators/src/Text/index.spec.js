import textValidator from './index';

test('text without xml tags should be valid', () => {
    expect(textValidator('someTextWithoutXMLTags')).toBe(null);
});

test('text with xml tags should not be valid', () => {
    expect(textValidator('someText<with>XMLTags')).not.toBe(null);
});

test('emptyish should pass', () => {
    expect(textValidator(null)).toBe(null);
    expect(textValidator(undefined)).toBe(null);
    expect(textValidator('')).toBe(null);
});
