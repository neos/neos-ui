import labelValidator from './index';

test('emptyish should pass', () => {
    expect(labelValidator(null)).toBe(null);
    expect(labelValidator(undefined)).toBe(null);
    expect(labelValidator('')).toBe(null);
});

test('"abc" should be a valid label', () => {
    expect(labelValidator('abc')).toBe(null);
});

test('"1abc" should be a valid label', () => {
    expect(labelValidator('1abc')).toBe(null);
});

test('"123" should be a valid label', () => {
    expect(labelValidator('123')).toBe(null);
});

test('"===abc" should be a valid label', () => {
    expect(labelValidator('===abc')).toBe(null);
});

test('"^abc" should not be a valid label', () => {
    expect(labelValidator('^abc')).not.toBe(null);
});

test('"{ abc }" should not be a valid label', () => {
    expect(labelValidator('{ abc }')).not.toBe(null);
});

test('"[ abc ]" should not be a valid label', () => {
    expect(labelValidator('[ abc ]')).not.toBe(null);
});

test('"( abc )" should be a valid label', () => {
    expect(labelValidator('( abc )')).toBe(null);
});
