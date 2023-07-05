import {cleanupContentBeforeCommit} from './cleanupContentBeforeCommit';

const assertCleanedUpContent = (input, expected) => {
    expect(cleanupContentBeforeCommit(input)).toBe(expected);
}

test('remove empty nbsp', () => {
    assertCleanedUpContent('<p>&nbsp;</p>', '');
    assertCleanedUpContent('<span>&nbsp;</span>', '');
})

describe('ckeditor DisabledAutoparagraphMode hack, cleanup outer spans', () => {
    test('noop', () => {
        assertCleanedUpContent('<p></p>', '<p></p>');

        assertCleanedUpContent('', '');

        assertCleanedUpContent('<span><span>foo</span></span>', '<span><span>foo</span></span>');
    })

    test('cleanup single root <span>', () => {
        assertCleanedUpContent('<span></span>', '');
        assertCleanedUpContent('<span>foo</span>', 'foo');
    })


    test('cleanup multiple root <span>', () => {
        assertCleanedUpContent('<span>foo</span><span>bar</span>', '<span>foo</span><span>bar</span>');
    })

    test('cleanup <span> root after other root', () => {
        // in the case you had multiple paragraphs and a headline and switched to autoparagraph: false
        assertCleanedUpContent('<h1>foo</h1><span>bar</span>', '<h1>foo</h1><span>bar</span>');
    })
})
