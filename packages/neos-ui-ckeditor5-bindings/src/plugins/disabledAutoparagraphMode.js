import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

/**
 * Legacy HACK -> our previous "inlineMode" the `autoparagraph: false` mode (from CKEditor 4) for backwards compatibility
 * @deprecated in favour of the serious "inlineMode"
 */
export default class DisabledAutoparagraphMode extends Plugin {
    static get pluginName() {
        return 'DisabledAutoparagraphMode';
    }

    init() {
        const {editor} = this;

        // we map paragraph model into plain <span> element
        editor.conversion.for('downcast').elementToElement({model: 'paragraph', view: 'span', converterPriority: 'high'});

        // we redefine enter key to create soft breaks (<br>) instead of new paragraphs
        editor.editing.view.document.on('enter', (evt, data) => {
            editor.execute('shiftEnter');
            data.preventDefault();
            evt.stop();
            editor.editing.view.scrollToTheSelection();
        }, {priority: 'high'});
    }
}
