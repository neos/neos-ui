import test from 'ava';

import labelValidator from './index';

test('empty value should be valid', t => {
    t.is(labelValidator(''), null);
});

test('"abc" should be a valid label', t => {
    t.is(labelValidator('abc'), null);
});

test('"1abc" should be a valid label', t => {
    t.is(labelValidator('1abc'), null);
});

test('"123" should be a valid label', t => {
    t.is(labelValidator('123'), null);
});

test('"===abc" should be a valid label', t => {
    t.is(labelValidator('===abc'), null);
});

test('"^abc" should not be a valid label', t => {
    t.not(labelValidator('^abc'), null);
});

test('"{ abc }" should not be a valid label', t => {
    t.not(labelValidator('{ abc }'), null);
});

test('"[ abc ]" should not be a valid label', t => {
    t.not(labelValidator('[ abc ]'), null);
});

test('"( abc )" should be a valid label', t => {
    t.is(labelValidator('( abc )'), null);
});
