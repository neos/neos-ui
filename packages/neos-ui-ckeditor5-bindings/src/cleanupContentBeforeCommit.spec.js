import {cleanupContentBeforeCommit} from './cleanupContentBeforeCommit'

const assertCleanedUpContent = (input, expected) => {
    expect(cleanupContentBeforeCommit(input)).toBe(expected);
}

test('remove empty nbsp', () => {
    assertCleanedUpContent('<p>&nbsp;</p>', '');
    assertCleanedUpContent('<span>&nbsp;</span>', '');
})
