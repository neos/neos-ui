import test from 'ava';

import uuidValidator from './index';

test('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa should be a valid uuid', t => {
    t.is(uuidValidator('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), null);
});

test('aaagaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa should not be a valid uuid', t => {
    t.not(uuidValidator('aaagaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), null);
});

test('aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa should not be a valid uuid', t => {
    t.not(uuidValidator('aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa'), null);
});

test('aaaaaaaa-aaaa-aaaa-aaaa-aaaa should not be a valid uuid', t => {
    t.not(uuidValidator('aaaaaaaa-aaaa-aaaa-aaaa-aaaa'), null);
});

test('aaaaaaaa-Aaaa-aaaa-aaaa-aaaaaaaaaaaa should not be a valid uuid', t => {
    t.not(uuidValidator('aaaaaaaa-Aaaa-aaaa-aaaa-aaaaaaaaaaaa'), null);
});

test('123 should not be a valid uuid', t => {
    t.not(uuidValidator('123'), null);
});
