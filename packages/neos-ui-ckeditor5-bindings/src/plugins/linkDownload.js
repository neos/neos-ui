import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkAttributeCommand from './linkAttributeCommand';

const DOWNLOAD = 'linkDownload';

export default class LinkDownload extends Plugin {
    static get pluginName() {
        return 'LinkDownload';
    }
    init() {
        const editor = this.editor;
        editor.model.schema.extend('$text', {allowAttributes: DOWNLOAD});
        editor.conversion.attributeToElement({
            model: DOWNLOAD,
            view: {
                name: 'a',
                attributes: {
                    download: ''
                },
                // the priority has got to be the same as here so the elements would get merged:
                // https://github.com/ckeditor/ckeditor5-link/blob/20e96361014fd13bfb93620f5eb5f528e6b1fe6d/src/utils.js#L33
                priority: 5
            }
        });
        editor.commands.add(DOWNLOAD, new LinkAttributeCommand(this.editor, DOWNLOAD));
    }
}
