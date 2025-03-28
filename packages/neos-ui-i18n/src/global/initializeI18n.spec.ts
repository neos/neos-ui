/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {translate} from '../translate';

import {I18nCouldNotBeInitialized, initializeI18n} from './initializeI18n';
import {teardownI18n} from './teardownI18n';

describe('initializeI18n', () => {
    beforeEach(() => {
        const server: typeof fetch = (input, init) => {
            expect(init?.credentials).toBe('include');

            const request = new Request(input, init);
            const url = new URL(request.url);

            switch (url.pathname) {
                case '/neos/xliff.json':
                    return Promise.resolve(
                        new Response(JSON.stringify({
                            Neos_Neos_Ui: {
                                Main: {
                                    'some_trans-unit_id':
                                        'This is the translation'
                                }
                            }
                        }), {headers: {'Content-Type': 'application/json'}})
                    );
                default:
                    return Promise.resolve(Response.error());
            }
        };
        jest.spyOn(global, 'fetch' as any).mockImplementation(server as any);
    });

    afterEach(() => {
        jest.resetAllMocks();
        teardownI18n();
    });

    it('loads the translation from the location specified in the current HTML document', async () => {
        document.head.innerHTML = `
            <link
                id="neos-ui-uri:/neos/xliff.json"
                href="https://example.com/neos/xliff.json?locale=en-US"
                data-locale="en-US"
                data-locale-plural-rules="one,other"
            />
        `;

        await initializeI18n();

        expect(translate('Neos.Neos.Ui:Main:some.trans-unit.id', 'This is the fallback'))
            .toBe('This is the translation');
    });

    it('rejects when i18n route link cannot be found', () => {
        // no tag at all
        document.head.innerHTML = '';

        expect(() => initializeI18n())
            .rejects.toThrow(
                I18nCouldNotBeInitialized.becauseRouteLinkCouldNotBeFound()
            );

        // link tag, but id is missing
        document.head.innerHTML = `
            <link
                href="https://example.com/neos/xliff.json?locale=en-US"
                data-locale="en-US"
                data-locale-plural-rules="one,other"
            />
        `;

        expect(() => initializeI18n())
            .rejects.toThrow(
                I18nCouldNotBeInitialized.becauseRouteLinkCouldNotBeFound()
            );

        // metag tag instead of link tag
        document.head.innerHTML = `
            <meta
                id="neos-ui-uri:/neos/xliff.json"
                href="https://example.com/neos/xliff.json?locale=en-US"
                data-locale="en-US"
                data-locale-plural-rules="one,other"
            />
        `;

        expect(() => initializeI18n())
            .rejects.toThrow(
                I18nCouldNotBeInitialized.becauseRouteLinkCouldNotBeFound()
            );
    });

    it('rejects when i18n route link has no "href" attribute', () => {
        document.head.innerHTML = `
            <link
                id="neos-ui-uri:/neos/xliff.json"
                data-locale="en-US"
                data-locale-plural-rules="one,other"
            />
        `;

        expect(() => initializeI18n())
            .rejects.toThrow(
                I18nCouldNotBeInitialized.becauseRouteLinkHasNoHref()
            );
    });

    it('rejects when i18n route link does not provide a valid URL has "href"', () => {
        // empty
        document.head.innerHTML = `
            <link
                id="neos-ui-uri:/neos/xliff.json"
                href=""
                data-locale="en-US"
                data-locale-plural-rules="one,other"
            />
        `;

        expect(() => initializeI18n())
            .rejects.toThrow(
                I18nCouldNotBeInitialized
                    .becauseRouteLinkHrefIsNotAValidURL('')
            );

        // not a URL at all
        document.head.innerHTML = `
            <link
                id="neos-ui-uri:/neos/xliff.json"
                href="something something"
                data-locale="en-US"
                data-locale-plural-rules="one,other"
            />
        `;

        expect(() => initializeI18n())
            .rejects.toThrow(
                I18nCouldNotBeInitialized
                    .becauseRouteLinkHrefIsNotAValidURL('something something')
            );

        // relative URL instead of absolute
        document.head.innerHTML = `
            <link
                id="neos-ui-uri:/neos/xliff.json"
                href="/neos/xliff.json?locale=en-US"
                data-locale="en-US"
                data-locale-plural-rules="one,other"
            />
        `;

        expect(() => initializeI18n())
            .rejects.toThrow(
                I18nCouldNotBeInitialized
                    .becauseRouteLinkHrefIsNotAValidURL('/neos/xliff.json?locale=en-US')
            );
    });

    it('rejects when i18n route link has no "data-locale" attribute', () => {
        document.head.innerHTML = `
            <link
                id="neos-ui-uri:/neos/xliff.json"
                href="https://example.com/neos/xliff.json?locale=en-US"
                data-locale-plural-rules="one,other"
            />
        `;

        expect(() => initializeI18n())
            .rejects.toThrow(
                I18nCouldNotBeInitialized.becauseRouteLinkHasNoLocale()
            );
    });

    it('rejects when i18n route link has no "data-locale-plural-rules" attribute', () => {
        document.head.innerHTML = `
            <link
                id="neos-ui-uri:/neos/xliff.json"
                href="https://example.com/neos/xliff.json?locale=en-US"
                data-locale="en-US"
            />
        `;

        expect(() => initializeI18n())
            .rejects.toThrow(
                I18nCouldNotBeInitialized.becauseRouteLinkHasNoPluralRules()
            );
    });
});
