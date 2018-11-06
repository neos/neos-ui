import debounce from 'lodash.debounce';
import removeTags from './ckeditor/removeTags';

const noop = {
    initialize() {},
    toggleFormat() {},
    createEditor() {}
};

// We cache the "formattingUnderCursor"; to only emit events when it really changed.
// As there is only a single cursor active at any given time, it is safe to do this caching here inside the singleton object.
let lastFormattingUnderCursorSerialized = '';

const createCKEditorAPI = CKEDITOR => {
    if (!CKEDITOR) {
        console.error('CKEditor not found!');

        //
        // Return noop to not break things
        //
        return noop;
    }

    // An object with the following keys:
    // - globalRegistry
    // - setFormattingUnderCursor
    // - setCurrentlyEditedPropertyName
    let editorConfig = null;
    let currentEditor = null;

    const handleUserInteractionCallbackFactory = editor => () => {
        const formattingUnderCursor = {};
        Object.keys(editorConfig.formattingRules).forEach(key => {
            const formattingRule = editorConfig.formattingRules[key];

            if (formattingRule.command !== undefined) {
                if (!editor.getCommand(formattingRule.command)) {
                    formattingUnderCursor[key] = false;
                    return;
                }

                formattingUnderCursor[key] = editor.getCommand(formattingRule.command).state;
                return;
            }

            if (formattingRule.style !== undefined) {
                if (!editor.elementPath()) {
                    formattingUnderCursor[key] = false;
                    return;
                }

                const style = new CKEDITOR.style(formattingRule.style); // eslint-disable-line babel/new-cap

                formattingUnderCursor[key] = style.checkActive(editor.elementPath(), editor);
                return;
            }

            if (formattingRule.extractCurrentFormatFn) {
                formattingUnderCursor[key] = formattingRule.extractCurrentFormatFn(editor, CKEDITOR);
                return;
            }

            throw new Error(`
                An error occured while checking a format in CK Editor.
                The description parameter needs to either have a key "command",
                a key "style", or a style "extractCurrentFormatFn" - none of which could be found.
            `);
        });

        const formattingUnderCursorSerialized = JSON.stringify(formattingUnderCursor);
        if (formattingUnderCursorSerialized !== lastFormattingUnderCursorSerialized) {
            editorConfig.setFormattingUnderCursor(formattingUnderCursor);
            lastFormattingUnderCursorSerialized = formattingUnderCursorSerialized;
        }
    };

    //
    // Perform global initialization tasks
    //
    CKEDITOR.disableAutoInline = true;

    //
    // Workaround as per http://stackoverflow.com/questions/14575036/enable-ckeditor4-inline-on-span-and-other-inline-tags
    // The issue won't be fixed, we have to live with this...
    //
    Object.assign(CKEDITOR.dtd.$editable, {
        b: true,
        big: true,
        i: true,
        small: true,
        tt: true,
        abbr: true,
        acronym: true,
        cite: true,
        code: true,
        dfn: true,
        em: true,
        kbd: true,
        strong: true,
        samp: true,
        var: true,
        a: true,
        bdo: true,
        img: true,
        q: true,
        span: true,
        sub: true,
        sup: true,
        button: true,
        label: true
    });

    // Public (singleton) API for CK editor
    return {
        initialize(_editorConfig) {
            editorConfig = _editorConfig;
            Object.values(editorConfig.plugins).forEach(plugin => {
                plugin.initFn(CKEDITOR);
            });
        },

        toggleFormat(formatting, formattingOptions = {}) {
            const formattingRule = editorConfig.formattingRules[formatting];
            if (!formattingRule) {
                console.warn(`Formatting instruction ${formatting} not found.`);
                return;
            }
            if (!currentEditor) {
                console.warn('Current editor not found!');
                return;
            }
            if (formattingRule.command !== undefined) {
                if (!currentEditor.getCommand(formattingRule.command)) {
                    console.warn(`Command ${currentEditor} not found.`);
                    return;
                }

                currentEditor.execCommand(formattingRule.command);
                currentEditor.fire('change');
                handleUserInteractionCallbackFactory(currentEditor)();
                return;
            }

            if (formattingRule.style !== undefined) {
                if (!currentEditor.elementPath()) {
                    return;
                }

                const style = new CKEDITOR.style(formattingRule.style); // eslint-disable-line babel/new-cap
                const operation = style.checkActive(currentEditor.elementPath(), currentEditor) ?
                    'removeStyle' : 'applyStyle';

                currentEditor[operation](style);
                currentEditor.fire('change');
                handleUserInteractionCallbackFactory(currentEditor)();
                return;
            }

            if (formattingRule.applyStyleFn) {
                formattingRule.applyStyleFn(formattingOptions, currentEditor, CKEDITOR);

                currentEditor.fire('change');
                handleUserInteractionCallbackFactory(currentEditor)();
                return;
            }

            throw new Error(`
                An error occured while applying a format in CK Editor.
                The description parameter needs to either have a key "command",
                "style", or "applyFn" - none of which could be found.
            `);
        },

        createEditor(dom, finalOptions, propertyName, onChange) {
            if (CKEDITOR.dtd.$inline[dom.tagName.toLowerCase()]) {
                // If we are an inline element, CKEditor breaks if we contain block-level children
                const containsBlockLevelChildren = [].slice.call(dom.childNodes).some(childNode => childNode.tagName && CKEDITOR.dtd.$block[childNode.tagName.toLowerCase()]);
                if (containsBlockLevelChildren) {
                    console.warn('The editable ', dom, ' of type <', dom.tagName.toLowerCase(), '> (which is an inline html element) contains block-level children (like p, div, ...). This is invalid markup and currently not supported by CKEditor; that is why we cannot edit it currently.');

                    const onClickRemoveTags = () => {
                        const text = removeTags(dom.innerHTML, CKEDITOR);
                        dom.innerHTML = text;
                        this.createEditor(dom, finalOptions, propertyName, onChange);

                        dom.removeEventListener('click', onClickRemoveTags);
                        // TODO FOCUS EDITOR directly - would be nice!
                    };

                    dom.addEventListener('click', onClickRemoveTags);
                    return;
                }
            }
            dom.contentEditable = 'true';

            const editor = CKEDITOR.inline(dom, finalOptions);

            editor.on('loaded', () => {
                if (editor.config.buttons) {
                    editor.config.buttons.forEach(button => {
                        // The next two lines actually do the ACF auto-configuration
                        const editorFeature = editor.ui.create(button);
                        editor.addFeature(editorFeature);
                    });
                }
            });

            const handleUserInteraction = handleUserInteractionCallbackFactory(editor);

            editor.on('contentDom', event => {
                event.editor.editable().on('contextmenu', contextEvent => {
                    const path = event.editor.elementPath();

                    if (!path.contains('table')) {
                        contextEvent.cancel();
                    }
                }, null, null, 5);
            });

            editor.once('contentDom', () => {
                editor.on('focus', () => {
                    currentEditor = editor;
                    editorConfig.setCurrentlyEditedPropertyName(propertyName);

                    handleUserInteraction();
                });

                editor.on('selectionChange', () => {
                    handleUserInteraction();
                });

                editor.on('change', debounce(() => onChange(editor.getData()), 500, {maxWait: 5000}));
            });
        }
    };
};

export default createCKEditorAPI(window.CKEDITOR);
