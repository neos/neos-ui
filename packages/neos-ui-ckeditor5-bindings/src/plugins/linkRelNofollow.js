import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkAttributeCommand from './linkAttributeCommand';

const REL_NOFOLLOW = 'linkRelNofollow';

export default class RelNofollow extends Plugin {
    static get pluginName() {
        return 'LinkRelNofollow';
    }
    init() {
        const editor = this.editor;
        editor.model.schema.extend('$text', {allowAttributes: REL_NOFOLLOW});
        editor.conversion.attributeToElement({
            model: REL_NOFOLLOW,
            view: {
                name: 'a',
                attributes: {
                    rel: 'nofollow'
                },
                // the priority has got to be the same as here so the elements would get merged:
                // https://github.com/ckeditor/ckeditor5-link/blob/20e96361014fd13bfb93620f5eb5f528e6b1fe6d/src/utils.js#L33
                priority: 5
            }
        });
        editor.commands.add(REL_NOFOLLOW, new LinkAttributeCommand(this.editor, REL_NOFOLLOW));
    }
}
