import CkEditorPluginsRegistry from './registry/CkEditorPluginsRegistry';
import neosPlaceholder from './ckeditor/neosPlaceholder';
import fixPasteIntoInlineElements from './ckeditor/fixPasteIntoInlineElements';

//
// Create richtext editing toolbar registry
//
export default ckEditorRegistry => {
    const plugins = ckEditorRegistry.set('plugins', new CkEditorPluginsRegistry(`
        Contains custom plugins for CkEditor.

        plugins.set('plugin_key', {
            initFn: pluginInitFunction
        });

        pluginInitFunction is passed CKEDITOR as the first argument.
        In that function you may register your plugin with CKeditor via its API (CKEDITOR.plugins.add).
        Take custom plugins as examples.
    `));

    //
    // Configure our custom ckEditor plugins
    //
    plugins.set('neos_placeholder', {
        initFn: neosPlaceholder
    });

    plugins.set('neos_fixPasteIntoInlineElements', {
        initFn: fixPasteIntoInlineElements
    });

    return plugins;
};
