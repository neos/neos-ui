import floatValidator from './index';

test('"1.2" should be a valid float', () => {
    expect(floatValidator('1.2')).toBe(null);
});

test('1.2 should be a valid float', () => {
    expect(floatValidator(1.2)).toBe(null);
});

test('".1" should be a valid float', () => {
    expect(floatValidator('.1')).toBe(null);
});

test('.1 should be a valid float', () => {
    expect(floatValidator(.1)).toBe(null); // eslint-disable-line
});

test('"1." should not be a valid float', () => {
    expect(floatValidator('1.')).not.toBe(null);
});

test('1. should not be a valid float', () => {
    expect(floatValidator(1.)).not.toBe(null); // eslint-disable-line
});

test('"1" should not be a valid float', () => {
    expect(floatValidator('1')).not.toBe(null);
});

test('1 should not be a valid float', () => {
    expect(floatValidator(1)).not.toBe(null);
});

test('1a should not be a valid float', () => {
    expect(floatValidator('1a')).not.toBe(null);
});

test('1.a should not be a valid float', () => {
    expect(floatValidator('1.a')).not.toBe(null);
});

test('1.2a should not be a valid float', () => {
    expect(floatValidator('1.2a')).not.toBe(null);
});

test('emptyish should pass', () => {
    expect(floatValidator(null)).toBe(null);
    expect(floatValidator(undefined)).toBe(null);
    expect(floatValidator('')).toBe(null);
});
