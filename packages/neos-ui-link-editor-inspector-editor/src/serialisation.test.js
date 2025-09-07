import {describe, it} from 'node:test';
import {deepEqual, equal} from 'node:assert/strict';
import {convertILinkToSerializedLinkValue, LinkDataType, serializedLinkToILink, resolveSerializedLinkFromValue} from "./serialisation";

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
                value: "http://marchenry.de"
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue('http://marchenry.de#tiefseeanker', LinkDataType.string),
            {
                dataType: LinkDataType.string,
                value: "http://marchenry.de#tiefseeanker"
            }
        )
    });

    it('serializedLinkToILink for string ', () => {
        equal(
            serializedLinkToILink({dataType: LinkDataType.string, value: null}),
            null
        )

        equal(
            serializedLinkToILink({dataType: LinkDataType.string, value: ""}),
            null
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.string, value: "http://marchenry.de"}),
            {
                href: "http://marchenry.de",
                options: {
                    anchor: undefined
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.string, value: "http://marchenry.de#tiefseeanker"}),
            {
                href: "http://marchenry.de",
                options: {
                    anchor: 'tiefseeanker'
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.string, value: "http://marchenry.de/some/path?query=foo#tiefseeanker"}),
            {
                href: "http://marchenry.de/some/path?query=foo",
                options: {
                    anchor: 'tiefseeanker'
                }
            }
        )
    });

    it('convertILinkToSerializedLinkValue for string ', () => {
        equal(
            convertILinkToSerializedLinkValue({href: "http://marchenry.de"}, LinkDataType.string),
            "http://marchenry.de"
        )

        equal(
            convertILinkToSerializedLinkValue({
                href: "http://marchenry.de",
                options: {
                    anchor: 'tiefseeanker'
                }
            }, LinkDataType.string),
            "http://marchenry.de#tiefseeanker"
        )

        // all other parts are discarded
        equal(
            convertILinkToSerializedLinkValue({
                href: "http://marchenry.de",
                options: {
                    anchor: 'tiefseeanker',
                    relNofollow: true,
                    targetBlank: true,
                    title: 'my title'
                }
            }, LinkDataType.string),
            "http://marchenry.de#tiefseeanker"
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
                    href: "http://marchenry.de"
                }
            }
        )

        deepEqual(
            resolveSerializedLinkFromValue({
                href: "http://marchenry.de#tiefseeanker",
                title: 'my title',
                target: '_blank',
                rel: ['nofollow'],
            }, LinkDataType.valueObject),
            {
                dataType: LinkDataType.valueObject,
                value: {
                    href: "http://marchenry.de#tiefseeanker",
                    title: 'my title',
                    target: '_blank',
                    rel: ['nofollow'],
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
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: ""}),
            null
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: "http://marchenry.de",
                title: undefined,
                target: undefined,
                rel: [],
            }}),
            {
                href: "http://marchenry.de",
                options: {
                    anchor: undefined,
                    relNofollow: false,
                    targetBlank: undefined,
                    title: undefined
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                href: "http://marchenry.de#tiefseeanker",
                title: undefined,
                target: undefined,
                rel: [],
            }}),
            {
                href: "http://marchenry.de",
                options: {
                    anchor: 'tiefseeanker',
                    relNofollow: false,
                    targetBlank: undefined,
                    title: undefined
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                    href: "http://marchenry.de",
                    title: 'some title',
                    target: undefined,
                    rel: [],
                }}),
            {
                href: "http://marchenry.de",
                options: {
                    anchor: undefined,
                    relNofollow: false,
                    targetBlank: undefined,
                    title: 'some title'
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                    href: "http://marchenry.de",
                    title: undefined,
                    target: '_self',
                    rel: [],
                }}),
            {
                href: "http://marchenry.de",
                options: {
                    anchor: undefined,
                    relNofollow: false,
                    targetBlank: false,
                    title: undefined
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                    href: "http://marchenry.de",
                    title: undefined,
                    target: '_blank',
                    rel: [],
                }}),
            {
                href: "http://marchenry.de",
                options: {
                    anchor: undefined,
                    relNofollow: false,
                    targetBlank: true,
                    title: undefined
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                    href: "http://marchenry.de",
                    title: undefined,
                    target: undefined,
                    rel: ['noopener'],
                }}),
            {
                href: "http://marchenry.de",
                options: {
                    anchor: undefined,
                    relNofollow: false,
                    targetBlank: undefined,
                    title: undefined
                }
            }
        )

        deepEqual(
            serializedLinkToILink({dataType: LinkDataType.valueObject, value: {
                    href: "http://marchenry.de",
                    title: undefined,
                    target: undefined,
                    rel: ['nofollow'],
                }}),
            {
                href: "http://marchenry.de",
                options: {
                    anchor: undefined,
                    relNofollow: true,
                    targetBlank: undefined,
                    title: undefined
                }
            }
        )
    });

    it('convertILinkToSerializedLinkValue for value object ', () => {
        deepEqual(
            convertILinkToSerializedLinkValue({href: "http://marchenry.de"}, LinkDataType.valueObject),
            {
                href: "http://marchenry.de",
                title: undefined,
                target: undefined,
                rel: [],
            }
        )

        deepEqual(
            convertILinkToSerializedLinkValue({
                href: "http://marchenry.de",
                options: {
                    anchor: 'tiefseeanker'
                }
            }, LinkDataType.valueObject),
            {
                href: "http://marchenry.de#tiefseeanker",
                title: undefined,
                target: undefined,
                rel: [],
            }
        )

        deepEqual(
            convertILinkToSerializedLinkValue({
                href: "http://marchenry.de",
                options: {
                    anchor: 'tiefseeanker',
                    relNofollow: true,
                    targetBlank: true,
                    title: 'my title'
                }
            }, LinkDataType.valueObject),
            {
                href: "http://marchenry.de#tiefseeanker",
                title: 'my title',
                target: '_blank',
                rel: ['nofollow'],
            }
        )
    });
});
