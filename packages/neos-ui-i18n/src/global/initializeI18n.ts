/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {setupI18n} from './setupI18n';

const LINK_ID_FOR_I18N_ROUTE = 'neos-ui-uri:/neos/xliff.json';

/**
 * @summary Initializes the Neos UI i18n mechanism globally
 * @description
 * Given a prepared HTML document that contains a <link>-tag with the id
 * "neos-ui-uri:/neos/xliff.json", this function will load translations from
 * the server endpoint specified in that tag's "href"-attribute.
 *
 * It will then set up the Neos UI i18n mechanism globally, with the locale
 * provided in the <link>-tag's "data-locale"-attribute, and the plural rule in
 * the order specified in the "data-locale-plural-rules"-attribute.
 */
export async function initializeI18n(): Promise<void> {
    const link = getLinkTag();
    const href = getHrefFromLinkTag(link);
    const locale = getLocaleFromLinkTag(link);
    const pluralRules = getPluralRulesFromLinkTag(link);

    const response = await fetch(href.toString(), {credentials: 'include'});
    const translations = await response.json();

    setupI18n(locale, pluralRules, translations);
}

function getPluralRulesFromLinkTag(link: HTMLLinkElement) {
    const pluralRules = link?.dataset.localePluralRules;
    if (pluralRules === undefined) {
        throw I18nCouldNotBeInitialized
            .becauseRouteLinkHasNoPluralRules();
    }
    return pluralRules;
}

function getLocaleFromLinkTag(link: HTMLLinkElement) {
    const locale = link?.dataset.locale;
    if (locale === undefined) {
        throw I18nCouldNotBeInitialized
            .becauseRouteLinkHasNoLocale();
    }
    return locale;
}

function getLinkTag() {
    const link = document.getElementById(LINK_ID_FOR_I18N_ROUTE);
    if (link === null || !(link instanceof HTMLLinkElement)) {
        throw I18nCouldNotBeInitialized
            .becauseRouteLinkCouldNotBeFound();
    }
    return link;
}

function getHrefFromLinkTag(link: HTMLLinkElement): URL {
    const href = link?.getAttribute('href');
    if (href === null) {
        throw I18nCouldNotBeInitialized
            .becauseRouteLinkHasNoHref();
    }

    try {
        return new URL(href);
    } catch {
        throw I18nCouldNotBeInitialized
            .becauseRouteLinkHrefIsNotAValidURL(href);
    }
}

export class I18nCouldNotBeInitialized extends Error {
    private constructor(message: string) {
        super(`I18n could not be initialized, because ${message}`);
    }

    public static becauseRouteLinkCouldNotBeFound = () =>
        new I18nCouldNotBeInitialized(
            `this document has no <link>-Tag with id "${LINK_ID_FOR_I18N_ROUTE}".`
        );

    public static becauseRouteLinkHasNoHref = () =>
        new I18nCouldNotBeInitialized(
            `the found <link>-Tag with id "${LINK_ID_FOR_I18N_ROUTE}" is`
            + ` missing an "href"-attribute.`
        );

    public static becauseRouteLinkHrefIsNotAValidURL = (attemptedValue: string) =>
        new I18nCouldNotBeInitialized(
            `the "href"-attribute of the <link>-Tag with id "${LINK_ID_FOR_I18N_ROUTE}"`
            + ` must be a valid, absolute URL, but was "${attemptedValue}".`
        );

    public static becauseRouteLinkHasNoLocale = () =>
        new I18nCouldNotBeInitialized(
            `the found <link>-Tag with id "${LINK_ID_FOR_I18N_ROUTE}" is`
            + ` missing a "data-locale"-attribute.`
        );

    public static becauseRouteLinkHasNoPluralRules = () =>
        new I18nCouldNotBeInitialized(
            `the found <link>-Tag with id "${LINK_ID_FOR_I18N_ROUTE}" is`
            + ` missing a "data-locale-plural-rules"-attribute.`
        );
}

