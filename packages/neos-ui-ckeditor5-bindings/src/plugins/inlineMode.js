import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

/**
 * HACK, since there is yet no native support
 * see https://github.com/ckeditor/ckeditor5/issues/762
 */
export default class InlineMode extends Plugin {
    static get pluginName() {
        return 'InlineMode';
    }
    init() {
        const editor = this.editor;

        // we map paragraph model into plain <span> element in edit mode
        editor.conversion.for('editingDowncast').elementToElement({model: 'paragraph', view: 'span', converterPriority: 'high'});

        // to avoid having a wrapping "span" tag, we will convert the outmost 'paragraph' ...
        // see https://neos-project.slack.com/archives/C07QEQ1U2/p1687952441254759 - i could find a better solution
        editor.conversion.for('dataDowncast').elementToElement({model: 'paragraph', view: ( modelElement, viewWriter ) => {
            const parentIsRoot = modelElement.parent.is('$root');
            const hasAttributes = [...modelElement.getAttributes()].length !== 0;
            if (!parentIsRoot || hasAttributes) {
                return viewWriter.createContainerElement('span');
            }
            return viewWriter.createContainerElement('neos-inline-wrapper');
        }, converterPriority: 'high'});

        // ... and strip the custom tag 'neos-inline-wrapper' in a hacky cleanup in cleanupData
        editor.data.decorate('get');
        editor.data.on('get', (event) => {
            event.return = cleanupNeosInlineWrapper(event.return)
        });

        // we redefine enter key to create soft breaks (<br>) instead of new paragraphs
        editor.editing.view.document.on('enter', (evt, data) => {
            editor.execute('shiftEnter');
            data.preventDefault();
            evt.stop();
            editor.editing.view.scrollToTheSelection();
        }, {priority: 'high'});
    }
}

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
