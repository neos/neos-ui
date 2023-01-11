import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ItalicWithEmEditing from './italicWithEmEditing';

export default class ItalicWithEm extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ItalicWithEmEditing];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ItalicWithEm';
    }
}

