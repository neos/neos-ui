import test from 'ava';

import get from './get';

test(`should be a function.`, t => {
    t.is(typeof (get), 'function');
});

test(`should return the 'neos' property of the given context.`, t => {
    const neos = {};
    const context = {neos};

    t.is(get(context), neos);
});

test(`should return an empty object in case no 'neos' property was found within the given context.`, t => {
    const context = {};

    const result = get(context);

    t.not(result, undefined);
    t.not(result, null);
    t.is(typeof (result), 'object');
});
