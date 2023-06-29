import {cleanupContentBeforeCommit} from './cleanupContentBeforeCommit'

const assertCleanedUpContent = (input, expected) => {
    expect(cleanupContentBeforeCommit(input)).toBe(expected);
}

test('remove empty nbsp', () => {
    assertCleanedUpContent('<p>&nbsp;</p>', '');
    assertCleanedUpContent('<span>&nbsp;</span>', '');
})

describe('ckeditor inline mode hack, cleanup <neos-inline-wrapper>', () => {
    test('noop', () => {
        assertCleanedUpContent('<p></p>', '<p></p>');

        assertCleanedUpContent('', '');
    })

    test('cleanup single <neos-inline-wrapper>', () => {
        assertCleanedUpContent('<neos-inline-wrapper></neos-inline-wrapper>', '');
        assertCleanedUpContent('<neos-inline-wrapper>foo</neos-inline-wrapper>', 'foo');

        assertCleanedUpContent('<neos-inline-wrapper><span>foo</span></neos-inline-wrapper>', '<span>foo</span>');
    })

    test('cleanup multiple <neos-inline-wrapper>', () => {
        assertCleanedUpContent('<neos-inline-wrapper>foo</neos-inline-wrapper><neos-inline-wrapper>bar</neos-inline-wrapper>', '<span>foo</span><span>bar</span>');

        assertCleanedUpContent('<neos-inline-wrapper>foo</neos-inline-wrapper><neos-inline-wrapper>bar</neos-inline-wrapper>', '<span>foo</span><span>bar</span>');
    })

    test('cleanup <neos-inline-wrapper> after other root', () => {
        // in the case you had multiple paragraphs and a headline and switched to autoparagrahp: false
        assertCleanedUpContent('<h1>foo</h1><neos-inline-wrapper>bar</neos-inline-wrapper>', '<h1>foo</h1><span>bar</span>');
    })
})
