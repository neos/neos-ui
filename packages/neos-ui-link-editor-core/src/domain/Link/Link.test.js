
import {describe, it} from 'node:test';
import {deepEqual, equal} from 'node:assert/strict';
import {createHrefWithAnchorForLink, parseBaseHrefAndAnchorFromValue} from './Link';

describe('Link conversion to base href and anchor', () => {

    it('createHrefWithAnchorForLink', () => {
        equal(
            createHrefWithAnchorForLink({ href: 'https://neos.de' }),
            'https://neos.de'
        )

        equal(
            createHrefWithAnchorForLink({ href: 'https://neos.de',  options: { anchor: undefined } }),
            'https://neos.de'
        )

        equal(
            createHrefWithAnchorForLink({ href: 'https://neos.de',  options: { anchor: '' } }),
            'https://neos.de'
        )

        equal(
            createHrefWithAnchorForLink({ href: 'https://neos.de', options: { anchor: 'tiefseeanker' } }),
            'https://neos.de#tiefseeanker'
        )

        equal(
            createHrefWithAnchorForLink({ href: '', options: { anchor: 'tiefseeanker' } }),
            '#tiefseeanker'
        )

        equal(
            createHrefWithAnchorForLink({ href: '' }),
            '#'
        )
    });


    it('createHrefWithAnchorForLink', () => {
        deepEqual(
            parseBaseHrefAndAnchorFromValue('https://neos.de'),
            {
                href: 'https://neos.de',
                anchor: undefined
            }
        )

        deepEqual(
            parseBaseHrefAndAnchorFromValue('https://neos.de#'),
            {
                href: 'https://neos.de',
                anchor: undefined
            }
        )

        deepEqual(
            parseBaseHrefAndAnchorFromValue('https://neos.de#tiefseeanker'),
            {
                href: 'https://neos.de',
                anchor: 'tiefseeanker'
            }
        )

        deepEqual(
            parseBaseHrefAndAnchorFromValue('#tiefseeanker'),
            {
                href: '',
                anchor: 'tiefseeanker'
            }
        )

        deepEqual(
            parseBaseHrefAndAnchorFromValue('#'),
            {
                href: '',
                anchor: undefined
            }
        )

        deepEqual(
            parseBaseHrefAndAnchorFromValue(''),
            {
                href: '',
                anchor: undefined
            }
        )
    });
})


