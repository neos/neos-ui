import {isResourceProtocol, normaliseLegacyResourcePath, getRedirectForPublicPackageResourceUriByPath} from './resourceStreamWrapper';

describe('isResourceProtocol', () => {
    it('matches valid strings', () => {
        expect(isResourceProtocol('resource://Neos.Bla/Public/Lol.js')).toBe(true)
        expect(isResourceProtocol('resource://Neos.Bla/Lol.js')).toBe(true)
    });

    it('rejects invalid strings', () => {
        expect(isResourceProtocol('')).toBe(false)
        expect(isResourceProtocol('foo-resource://Neos.Bla/Lol.js')).toBe(false)
    });
});

describe('normaliseLegacyResourcePath', () => {
    it('inserts public segment if missing', () => {
        expect(normaliseLegacyResourcePath('resource://Neos.Bla/Lol.js')).toBe('resource://Neos.Bla/Public/Lol.js')
    });
    it('keeps proper paths intact', () => {
        expect(normaliseLegacyResourcePath('resource://Neos.Bla/Public/Lol.js')).toBe('resource://Neos.Bla/Public/Lol.js')
    });
    it('ignores invalid strings', () => {
        expect(normaliseLegacyResourcePath('')).toBe('')
        expect(normaliseLegacyResourcePath('resource://Neos.Bla')).toBe('resource://Neos.Bla')
    });
});

describe('getRedirectForPublicPackageResourceUriByPath', () => {
    it('creates service uri with query parameter', () => {
        expect(getRedirectForPublicPackageResourceUriByPath('resource://Neos.Bla/Public/Lol.js')).toBe('/neos/ui-services/redirect-resource-uri?resourcePath=resource%3A%2F%2FNeos.Bla%2FPublic%2FLol.js')
    });
});
