import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkAttributeCommand from './linkAttributeCommand';

const TITLE = 'linkTitle';

export default class LinkTitle extends Plugin {
    static get pluginName() {
        return 'LinkTitle';
    }

    init() {
        const editor = this.editor;
        editor.model.schema.extend('$text', {allowAttributes: TITLE});

        editor.conversion.for('downcast').attributeToElement({
            model: TITLE,
            view: (title, writer) => {
                // the priority has got to be the same as here so the elements would get merged:
                // https://github.com/ckeditor/ckeditor5-link/blob/20e96361014fd13bfb93620f5eb5f528e6b1fe6d/src/utils.js#L33
                const linkElement = writer.createAttributeElement('a', {title}, {priority: 5});
                return linkElement;
            }
        });
        editor.conversion.for('upcast')
            .elementToAttribute({
                view: {
                    name: 'a',
                    attributes: {
                        title: true
                    }
                },
                model: {
                    key: TITLE,
                    value: viewElement => viewElement.getAttribute('title')
                }
            });
        editor.commands.add(TITLE, new LinkAttributeCommand(this.editor, TITLE));
    }
}
