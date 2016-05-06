//
// Do not run initialization task twice
//
let singleton = null;

//
// Binds the native CK API to a simplified method that will
// create an editor
//
const createCreate = nativeApi => (dom, configuration) => {
    const finalOptions = Object.assign(
        {
            removePlugins: 'toolbar,contextmenu,liststyle,tabletools',
            allowedContent: true,
            extraPlugins: 'removeformat'
        },

        //
        // Apply configured placeholder here
        //
        configuration.placeholder ? {
            extraPlugins: 'confighelper',
            placeholder: configuration.placeholder
        } : {}
    );

    return nativeApi.inline(dom, finalOptions);
};

//
// Binds the native CK API to a simplified method that will
// apply a command or a style depending on the `description`
// parameter.
//
// `description` can take the following shapes:
//
// { command: 'someCommand' } - will apply a command
// { style: 'someStyle' } - will apply a style
//
const createToggleFormat = nativeApi => (editor, description) => {
    if (description.command !== undefined) {
        if (!editor.getCommand(description.command)) {
            return editor;
        }

        editor.execCommand(description.command);
        return editor;
    }

    if (description.style !== undefined) {
        if (!editor.elementPath()) {
            return editor;
        }

        const StyleClass = nativeApi.style;
        const style = new StyleClass(description.style);
        const operation = style.checkActive(editor.elementPath(), editor) ?
            'removeStyle' : 'applyStyle';

        editor[operation](style);
        editor.fire('change');
        return editor;
    }

    throw new Error(`
        An error occured while applying a format in CK Editor.
        The description parameter needs to either have a key "command" or
        a key "style" - none of which could be found.
    `);
};

//
// Binds the native CK API to a simplified method that will
// check, if a command or a style is applied, depending on the
// `description` parameter.
//
// `description` can take the following shapes:
//
// { command: 'someCommand' } - will apply a command
// { style: 'someStyle' } - will apply a style
//
const createIsFormatActive = nativeApi => (editor, description) => {
    if (description.command !== undefined) {
        if (!editor.getCommand(description.command)) {
            return false;
        }

        return editor.getCommand(description.command).state === nativeApi.TRISTATE_ON;
    }

    if (description.style !== undefined) {
        if (!editor.elementPath()) {
            return false;
        }

        const StyleClass = nativeApi.style;
        const style = new StyleClass(description.style);

        return style.checkActive(editor.elementPath(), editor);
    }

    throw new Error(`
        An error occured while checking a format in CK Editor.
        The description parameter needs to either have a key "command" or
        a key "style" - none of which could be found.
    `);
};

//
// A factory function to ensure testability
//
const createCKEditorAPI = nativeApi => {
    if (singleton) {
        return singleton;
    }

    if (!nativeApi) {
        console.error('CKEditor not found!');

        //
        // Return noop to not break things
        //
        return () => {};
    }

    //
    // Perform global initialization tasks
    //
    nativeApi.disableAutoInline = true;

    const create = createCreate(nativeApi);
    const toggleFormat = createToggleFormat(nativeApi);
    const isFormatActive = createIsFormatActive(nativeApi);

    singleton = {
        create,
        toggleFormat,
        isFormatActive
    };

    return singleton;
};

//
// Export the simplified API bound to the native API that can be
// found in window.
//
export default createCKEditorAPI(window.CKEDITOR);
