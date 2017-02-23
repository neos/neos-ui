import test from 'ava';

import regularExpressionValidator from './index';

test('"/^abc$/" should match "abc"', t => {
    const validatorOptions = {
        regularExpression: '/^abc$/'
    };

    t.is(regularExpressionValidator('abc', validatorOptions), null);
});

test('"/^abc$/" should not match "aac"', t => {
    const validatorOptions = {
        regularExpression: '/^abc$/'
    };

    t.not(regularExpressionValidator('aac', validatorOptions), null);
});

test('"/^abc.*$/" should match "abcaaaaa"', t => {
    const validatorOptions = {
        regularExpression: '/^abc.*$/'
    };

    t.is(regularExpressionValidator('abcaaaaa', validatorOptions), null);
});

test('"/abc/" should match "aaaabcaaa"', t => {
    const validatorOptions = {
        regularExpression: '/abc/'
    };

    t.is(regularExpressionValidator('aaaabcaaa', validatorOptions), null);
});

test('"/\\d/" should match "1"', t => {
    const validatorOptions = {
        regularExpression: '/\\d/'
    };

    t.is(regularExpressionValidator('1', validatorOptions), null);
});

test('"/\\d/" should not match "a"', t => {
    const validatorOptions = {
        regularExpression: '/\\d/'
    };

    t.not(regularExpressionValidator('a', validatorOptions), null);
});
