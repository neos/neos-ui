import test from 'ava';

import dateTimeValidator from './index';

test('1234-12-12T12:12:12-12:12 should be a valid datetime', t => {
    t.is(dateTimeValidator('1234-12-12T12:12:12-12:12'), null);
});

test('1234-12-12T12:12:12+12:12 should be a valid datetime', t => {
    t.is(dateTimeValidator('1234-12-12T12:12:12+12:12'), null);
});

test('1234-12-12T12:1212-12:12 should not be a valid datetime', t => {
    t.not(dateTimeValidator('1234-12-12T12:1212-12:12'), null);
});

test('1234-1212T12:12:12+12:12 should not be a valid datetime', t => {
    t.not(dateTimeValidator('1234-1212T12:12:12+12:12'), null);
});

test('1234-12-12D12:12:12+12:12 should not be a valid datetime', t => {
    t.not(dateTimeValidator('1234-12-12D12:12:12+12:12'), null);
});
