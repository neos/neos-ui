import {describe, it} from 'node:test';
import {deepEqual, equal} from 'node:assert/strict';
import {convertILinkToSerializedLinkValue, LinkDataType, serializedLinkToILink, resolveSerializedLinkFromValue} from './serialisation';

describe('InspectorEditor: serialisation', () => {
    it('resolveSerializedLinkFromValue for string ', () => {
        deepEqual(
            resolveSerializedLinkFromValue(null, LinkDataType.string),
            {
                dataType: LinkDataType.string,
                value: null
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue('', LinkDataType.string),
            {
                dataType: LinkDataType.string,
                value: null
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue('http://marchenry.de', LinkDataType.string),
            {
                dataType: LinkDataType.string,
                value: 'http://marchenry.de'
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue('http://marchenry.de#tiefseeanker', LinkDataType.string),
            {
                dataType: LinkDataType.string,
                value: 'http://marchenry.de#tiefseeanker'
            }
        )
    });

    it('serializedLinkToILink for string ', () => {
        equal(
            serializedLinkToILink({dataType: LinkDataType.string, value: null}),
            null
        )

        equal(
            serializedLinkToILink({dataType: LinkDataType.string, value: ''}),
            null
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.string, value: 'http://marchenry.de'}),
            {
                href: 'http://marchenry.de'
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.string, value: 'http://marchenry.de#tiefseeanker'}),
            {
                href: 'http://marchenry.de#tiefseeanker'
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.string, value: 'http://marchenry.de/some/path?query=foo#tiefseeanker'}),
            {
                href: 'http://marchenry.de/some/path?query=foo#tiefseeanker'
            }
        )
    });

    it('convertILinkToSerializedLinkValue for string ', () => {
        equal(
            convertILinkToSerializedLinkValue({href: 'http://marchenry.de'}, LinkDataType.string),
            'http://marchenry.de'
        )

        equal(
            convertILinkToSerializedLinkValue({
                href: 'http://marchenry.de#tiefseeanker'
            }, LinkDataType.string),
            'http://marchenry.de#tiefseeanker'
        )

        // all other parts are discarded
        equal(
            convertILinkToSerializedLinkValue({
                href: 'http://marchenry.de#tiefseeanker',
                options: {
                    relNofollow: true,
                    targetBlank: true,
                    title: 'my title',
                    download: true
                }
            }, LinkDataType.string),
            'http://marchenry.de#tiefseeanker'
        )
    });

    it('resolveSerializedLinkFromValue for valueObject ', () => {
        deepEqual(
            resolveSerializedLinkFromValue(null, LinkDataType.valueObject),
            {
                dataType: LinkDataType.valueObject,
                value: null
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue('', LinkDataType.valueObject),
            {
                dataType: LinkDataType.valueObject,
                value: null
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue([], LinkDataType.valueObject),
            {
                dataType: LinkDataType.valueObject,
                value: null
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue({}, LinkDataType.valueObject),
            {
                dataType: LinkDataType.valueObject,
                value: null
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue({gibberish: 'tja'}, LinkDataType.valueObject),
            {
                dataType: LinkDataType.valueObject,
                value: null
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue({
                href: 'http://marchenry.de'
            }, LinkDataType.valueObject),
            {
                dataType: LinkDataType.valueObject,
                value: {
                    href: 'http://marchenry.de'
                }
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue({
                href: 'http://marchenry.de#tiefseeanker',
                title: 'my title',
                target: '_blank',
                rel: ['nofollow']
            }, LinkDataType.valueObject),
            {
                dataType: LinkDataType.valueObject,
                value: {
                    href: 'http://marchenry.de#tiefseeanker',
                    title: 'my title',
                    target: '_blank',
                    rel: ['nofollow']
                }
            }
        )
    });

    it('serializedLinkToILink for valueObject ', () => {
        equal(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: null}),
            null
        )

        equal(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: ''}),
            null
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: 'http://marchenry.de',
                title: undefined,
                target: undefined,
                rel: [],
                download: undefined
            }}),
            {
                href: 'http://marchenry.de',
                options: {
                    relNofollow: false,
                    targetBlank: undefined,
                    title: undefined,
                    download: false
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: 'http://marchenry.de#tiefseeanker',
                title: undefined,
                target: undefined,
                rel: [],
                download: false
            }}),
            {
                href: 'http://marchenry.de#tiefseeanker',
                options: {
                    relNofollow: false,
                    targetBlank: undefined,
                    title: undefined,
                    download: false
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: 'http://marchenry.de',
                title: 'some title',
                target: undefined,
                rel: [],
                download: undefined
            }}),
            {
                href: 'http://marchenry.de',
                options: {
                    relNofollow: false,
                    targetBlank: undefined,
                    title: 'some title',
                    download: false
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: 'http://marchenry.de',
                title: undefined,
                target: '_self',
                rel: [],
                download: undefined
            }}),
            {
                href: 'http://marchenry.de',
                options: {
                    relNofollow: false,
                    targetBlank: false,
                    title: undefined,
                    download: false
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: 'http://marchenry.de',
                title: undefined,
                target: '_blank',
                rel: [],
                download: undefined
            }}),
            {
                href: 'http://marchenry.de',
                options: {
                    relNofollow: false,
                    targetBlank: true,
                    title: undefined,
                    download: false
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: 'http://marchenry.de',
                title: undefined,
                target: undefined,
                rel: ['noopener'],
                download: undefined
            }}),
            {
                href: 'http://marchenry.de',
                options: {
                    relNofollow: false,
                    targetBlank: undefined,
                    title: undefined,
                    download: false
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: 'http://marchenry.de',
                title: undefined,
                target: undefined,
                rel: ['nofollow'],
                download: undefined
            }}),
            {
                href: 'http://marchenry.de',
                options: {
                    relNofollow: true,
                    targetBlank: undefined,
                    title: undefined,
                    download: false
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: 'http://marchenry.de',
                title: undefined,
                target: undefined,
                rel: [],
                download: true
            }}),
            {
                href: 'http://marchenry.de',
                options: {
                    relNofollow: false,
                    targetBlank: undefined,
                    title: undefined,
                    download: true
                }
            }
        )
    });

    it('convertILinkToSerializedLinkValue for value object ', () => {
        deepEqual(
            convertILinkToSerializedLinkValue({href: 'http://marchenry.de'}, LinkDataType.valueObject),
            {
                href: 'http://marchenry.de',
                title: undefined,
                target: undefined,
                rel: [],
                download: undefined
            }
        )

        deepEqual(
            convertILinkToSerializedLinkValue({
                href: 'http://marchenry.de#tiefseeanker'
            }, LinkDataType.valueObject),
            {
                href: 'http://marchenry.de#tiefseeanker',
                title: undefined,
                target: undefined,
                rel: [],
                download: undefined
            }
        )

        deepEqual(
            convertILinkToSerializedLinkValue({
                href: 'http://marchenry.de#tiefseeanker',
                options: {
                    relNofollow: true,
                    targetBlank: true,
                    title: 'my title',
                    download: true
                }
            }, LinkDataType.valueObject),
            {
                href: 'http://marchenry.de#tiefseeanker',
                title: 'my title',
                target: '_blank',
                rel: ['nofollow'],
                download: true
            }
        )
    });
});
