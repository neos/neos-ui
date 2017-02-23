import test from 'ava';

import alphanumericValidator from './index';

test('"a1b2" should be alphanumeric', t => {
    t.is(alphanumericValidator('a1b2'), null);
});

test('"ÄÖÜß" should be alphanumeric', t => {
    t.is(alphanumericValidator('ÄÖÜß'), null);
});

test('"!ÄÖÜß" should not be alphanumeric', t => {
    t.not(alphanumericValidator('!ÄÖÜß'), null);
});

test('"--" should not be alphanumeric', t => {
    t.not(alphanumericValidator('--'), null);
});

test('"ab c" should not be alphanumeric', t => {
    t.not(alphanumericValidator('ab c'), null);
});

test('empty value should be valid', t => {
    t.is(alphanumericValidator(''), null);
});
