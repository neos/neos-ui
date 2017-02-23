import test from 'ava';

import floatValidator from './index';

test('"1.2" should be a valid float', t => {
    t.is(floatValidator('1.2'), null);
});

test('1.2 should be a valid float', t => {
    t.is(floatValidator(1.2), null);
});

test('".1" should be a valid float', t => {
    t.is(floatValidator('.1'), null);
});

test('.1 should be a valid float', t => {
    t.is(floatValidator(.1), null); // eslint-disable-line
});

test('"1." should not be a valid float', t => {
    t.not(floatValidator('1.'), null);
});

test('1. should not be a valid float', t => {
    t.not(floatValidator(1.), null); // eslint-disable-line
});

test('"1" should not be a valid float', t => {
    t.not(floatValidator('1'), null);
});

test('1 should not be a valid float', t => {
    t.not(floatValidator(1), null);
});
