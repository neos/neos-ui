import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class InlineMode extends Plugin {
    static get pluginName() {
        return 'InlineMode';
    }
    init() {
        const editor = this.editor;

        // We map paragraph model into plain <span> element
        editor.conversion.elementToElement({model: 'paragraph', view: 'span', converterPriority: 'high'});

        // We redefine enter key to great soft breaks instead of paragraphs
        editor.editing.view.document.on('enter', (evt, data) => {
            editor.execute('shiftEnter');
            data.preventDefault();
            evt.stop();
            editor.editing.view.scrollToTheSelection();
        }, {priority: 'high'});
    }
}
