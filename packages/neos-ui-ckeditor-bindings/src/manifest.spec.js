import test from 'ava';

import {createConsumerApi} from '@neos-project/neos-ui-extensibility/';
import {manifests} from '@neos-project/neos-ui-extensibility/src/manifest';


//
// Mock the host plugin api, to test the manifest
//
createConsumerApi({});

import './manifest';

test(`should create manifest entry with no options.`, t => {
    const manifestEntry = manifests.filter(entry => entry['@neos-project/neos-ui-ckeditor-bindings'])[0];

    t.not(manifestEntry, undefined);
    t.deepEqual(manifestEntry['@neos-project/neos-ui-ckeditor-bindings'].options, {});
    t.is(typeof (manifestEntry['@neos-project/neos-ui-ckeditor-bindings'].bootstrap), 'function');
});

test.todo(`Add tests for the bootstrap function.`);
