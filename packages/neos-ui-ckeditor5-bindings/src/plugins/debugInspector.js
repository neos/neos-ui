import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

export default class DebugInspector extends Plugin {
    static get pluginName() {
        return 'CKEditorInspector';
    }
    afterInit() {
        CKEditorInspector.attach(this.editor);
    }
}
