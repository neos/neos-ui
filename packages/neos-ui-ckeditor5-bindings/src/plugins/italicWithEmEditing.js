import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// same as ItalicEditing Plugin from CKEditor5
const ITALIC = 'italic';

/**
 * Custom Plugin to replace <i> with <em> tags.
 * @fixes https://github.com/neos/neos-ui/issues/2906
 *
 * Original Italic Plugin at '@ckeditor/ckeditor5-basic-styles/src/italic/italicediting.js'
 */
export default class ItalicWithEmEditing extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ItalicWithEmEditing';
    }

    /**
     * @inheritDoc
     */
    init() {
        this.editor.conversion.for('downcast').attributeToElement({
            model: ITALIC,
            view: 'em',
            converterPriority: 'high'
        });
    }
}
