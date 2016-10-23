import test from 'ava';

import {isManifestLoaded, getManifest} from '@neos-project/build-essentials/src/neos-ui';

import './manifest';

test(`should create manifest entry with no options.`, t => {
    t.true(isManifestLoaded('@neos-project/neos-ui-ckeditor-bindings'));

    const manifestEntry = getManifest('@neos-project/neos-ui-ckeditor-bindings')

    t.deepEqual(manifestEntry.options, {});
    t.is(typeof (manifestEntry.bootstrap), 'function');
});

test.todo(`Add tests for the bootstrap function.`);
