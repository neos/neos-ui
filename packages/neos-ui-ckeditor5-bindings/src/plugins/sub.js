import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

const SUB = 'sub';

export default class SubSup extends Plugin {
    static get pluginName() {
        return 'Sub';
    }
    init() {
        this.editor.model.schema.extend('$text', {allowAttributes: SUB});
        this.editor.conversion.attributeToElement({
            model: SUB,
            view: 'sub'
        });
        this.editor.commands.add(SUB, new AttributeCommand(this.editor, SUB));
    }
}
