import test from 'ava';

import notEmptyValidator from './index';

test('"aaa" should not be empty', t => {
    t.is(notEmptyValidator('aaa'), null);
});

test('"" should be empty', t => {
    t.not(notEmptyValidator(''), null);
});

test('[] should be empty', t => {
    t.not(notEmptyValidator([]), null);
});

test('[1,2,3] should not be empty', t => {
    t.is(notEmptyValidator([1, 2, 3]), null);
});
