import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

/**
 * HACK, since there is yet no native support for CKEditor 4 autoparagraph false
 * see https://github.com/ckeditor/ckeditor5/issues/762
 *
 * We will try to find a serious alternative see https://github.com/neos/neos-ui/pull/3553
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
