import {isManifestLoaded, getManifest} from '@neos-project/build-essentials/src/neos-ui';

import './manifest';

test(`should create manifest entry with no options.`, () => {
    expect(isManifestLoaded('@neos-project/neos-ui-contentrepository')).toBe(true);

    const manifestEntry = getManifest('@neos-project/neos-ui-contentrepository');

    expect(manifestEntry.options).toEqual({});
    expect(typeof (manifestEntry.bootstrap)).toBe('function');
});

test(`Add tests for the bootstrap function.`, () => {
    expect(true).toBe(true);
});
