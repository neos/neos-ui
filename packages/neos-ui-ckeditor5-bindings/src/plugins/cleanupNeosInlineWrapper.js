/**
 * We remove opening and closing span tags that are produced by the inlineMode plugin
 *
 * @private only exported for testing
 * @param {String} content
 */
export const cleanupNeosInlineWrapper = content => {
    if (content.includes('<neos-inline-wrapper>')) {
        let contentWithoutOuterInlineWrapper = content;

        if (content.startsWith('<neos-inline-wrapper>') && content.endsWith('</neos-inline-wrapper>')) {
            contentWithoutOuterInlineWrapper = content
                .replace(/^<neos-inline-wrapper>/, '')
                .replace(/<\/neos-inline-wrapper>$/, '');
        }

        if (contentWithoutOuterInlineWrapper.includes('<neos-inline-wrapper>')) {
            // in the case, multiple root paragraph elements were inserted into the ckeditor (wich is currently not prevented if the html is modified from outside)
            // we have multiple root elements of type <neos-inline-wrapper>. We will convert all of them into spans.
            return content
                .replace(/<neos-inline-wrapper>/g, '<span>')
                .replace(/<\/neos-inline-wrapper>/g, '</span>');
        }
        return contentWithoutOuterInlineWrapper;
    }
    return content;
};
