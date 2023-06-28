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

        // we avoid multiple paragraph's to be created - eg when pasting a text with newlines (this will created soft breaks (<br>))
        editor.model.schema.extend('paragraph', { isLimit: true });


        // we map paragraph model into plain <span> element in edit mode
        editor.conversion.for('editingDowncast').elementToElement({model: 'paragraph', view: 'span', converterPriority: 'high'});

        // to avoid having a wrapping "span" tag, we will convert the outmost 'paragraph' and strip the custom tag 'neos-inline-wrapper'
        // in a hacky cleanup in cleanupContentBeforeCommit
        // see https://neos-project.slack.com/archives/C07QEQ1U2/p1687952441254759 - i could find a better solution
        editor.conversion.for('dataDowncast').elementToElement({model: 'paragraph', view: ( modelElement, viewWriter ) => {
            const parentIsRoot = modelElement.parent.is('$root');
            const hasAttributes = [...modelElement.getAttributes()].length !== 0;
            if (!parentIsRoot || hasAttributes) {
                return viewWriter.createContainerElement('span');
            }
            return viewWriter.createContainerElement('neos-inline-wrapper');
        }, converterPriority: 'high'});

        // we redefine enter key to create soft breaks (<br>) instead of new paragraphs
        editor.editing.view.document.on('enter', (evt, data) => {
            editor.execute('shiftEnter');
            data.preventDefault();
            evt.stop();
            editor.editing.view.scrollToTheSelection();
        }, {priority: 'high'});
    }
}
