import test from 'ava';

import textValidator from './index';

test('text without xml tags should be valid', t => {
    t.is(textValidator('someTextWithoutXMLTags'), null);
});

test('text with xml tags should not be valid', t => {
    t.not(textValidator('someText<with>XMLTags'), null);
});
