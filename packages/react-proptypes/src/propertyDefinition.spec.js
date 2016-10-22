import test from 'ava';

import propertyDefinition from './propertyDefinition';


test(`should export a function.`, t => {
    t.is(typeof (propertyDefinition), 'function');
});

test.todo(`Figure out a way to test propTypes`);
