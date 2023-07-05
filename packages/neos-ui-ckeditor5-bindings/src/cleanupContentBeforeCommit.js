/** @param {String} content */
export const cleanupContentBeforeCommit = content => {
    // TODO: remove when this is fixed: https://github.com/ckeditor/ckeditor5/issues/401
    if (content.match(/^<([a-z][a-z0-9]*)\b[^>]*>&nbsp;<\/\1>$/)) {
        return '';
    }

    // We remove opening and closing span tags that are produced by the `DisabledAutoparagraphMode` plugin
    if (content.startsWith('<span>') && content.endsWith('</span>')) {
        const contentWithoutOuterSpan = content
            .replace(/^<span>/, '')
            .replace(/<\/span>$/, '');

        if (contentWithoutOuterSpan.includes('<span>')) {
            // In case there is still a span tag, we can be sure that the previously trimmed ones were belonging together,
            // as it could be the case that multiple root paragraph/span elements were inserted into the ckeditor
            // (which is currently not prevented if the html is modified from outside), so we will preserve the output.
            return content;
        }
        return contentWithoutOuterSpan;
    }
    return content;
};
