import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

const SUP = 'sup';

export default class Sup extends Plugin {
    static get pluginName() {
        return 'Sup';
    }
    init() {
        this.editor.model.schema.extend('$text', {allowAttributes: SUP});
        this.editor.conversion.attributeToElement({
            model: SUP,
            view: 'sup'
        });
        this.editor.commands.add(SUP, new AttributeCommand(this.editor, SUP));
    }
}
