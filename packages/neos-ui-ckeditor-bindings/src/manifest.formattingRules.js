import CkEditorFormattingRulesRegistry from './registry/CkEditorFormattingRulesRegistry';

export default ckEditorRegistry => {
    const formattingRules = ckEditorRegistry.set('formattingRules', new CkEditorFormattingRulesRegistry(`
        Contains the possible styles for CKeditor.

        ## Enabled Styles

        The actual *enabled* styles are determined by the NodeTypes configuration of the property.
        This means, that if the node is configured using NodeTypes
        \`properties.[propertyName].ui.aloha.formatting.strong=true\`, then the "strong" key inside this registry
        is actually enabled for the editor.

        For backwards compatibility reasons, the formatting-and-styling-registry *KEYS* must match the "pre-React"
        UI, if they existed beforehand.


        ## Configuration of CKeditor

        With this config, CKeditor itself is controlled:
        - the Advanced Content Filter (ACF) is configured, thus which markup is allowed in the editors
        - which effect a button action actually has.

        Currently, there exist three possible effects:
        - *triggering a command*
        - *setting a style*
        - *executing arbitrary code*


        ## Configuration Format:

        NOTE: one of "command" or "style" must be specified in all cases.

        - \`command\` (string, optional). If specified, this CKEditor command is triggered; so the command string
            is known by CKeditor in the "commands" section:
            http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-getCommand

        - \`style\` (object, optional). If specified, this CKEditor style is applied. Expects a style description
            adhering to CKEDITOR.style(...), so for example: \`{ style: {element: 'h1'}\`

        - \`config\` (function, optional): This function needs to adjust the CKEditor config to e.g. configure ACF
            correctly. The function gets passed in the config so-far, AND the configuration from the node type underneath
            "ui.inline.editorOptions.formatting.[formatingRuleName]" and needs to return the modified config. See
            "CKEditor Configuration Helpers" below for helper functions.

        - \`extractCurrentFormatFn\` (function, optional): If specified, this function will extract the current format.
            The function gets passed the currend "editor" and "CKEDITOR".

        - \`applyStyleFn\` (function, optional): This function applies a style to CKEditor.
            Arguments: formattingOptions, editor, CKEDITOR.

        ## CKEditor Configuration Helpers

        - \`config: registry.ckEditor.formattingRules.config.addToFormatTags('h1')\`: adds the passed-in tag to the
            \`format_tags\` configuration option of CKEditor.

        - \`registry.ckEditor.formattingRules.config.add('Strong')\`: adds the passed-in *Button Definition Name*
            to the ACF configuration (automatic mode). This means the button names are standard CKEditor config
            buttons, like "Cut,Copy,Paste,Undo,Redo,Anchor".
    `));

    /**
     * Basic Inline Styles (Bold, Italic, ...)
     */

    // Bold
    formattingRules.set('strong', {
        command: 'bold',
        config: formattingRules.config.add('Bold')
    });

    // Italic
    formattingRules.set('em', {
        command: 'italic',
        config: formattingRules.config.add('Italic')
    });

    // Underline
    formattingRules.set('u', {
        command: 'underline',
        config: formattingRules.config.add('Underline')
    });

    // Subscript
    formattingRules.set('sub', {
        command: 'subscript',
        config: formattingRules.config.add('Subscript')
    });

    // Superscript
    formattingRules.set('sup', {
        command: 'superscript',
        config: formattingRules.config.add('Superscript')
    });

    // Strike-Through
    formattingRules.set('del', {
        command: 'strike',
        config: formattingRules.config.add('Strike')
    });

    /**
     * Basic Paragraph Styles (p, h1, h2, pre, ...)
     */

    // p tag
    formattingRules.set('p', {
        style: {element: 'p'},
        config: formattingRules.config.addToFormatTags('p')
    });

    // H1
    formattingRules.set('h1', {
        style: {element: 'h1'},
        config: formattingRules.config.addToFormatTags('h1')
    });

    // H2
    formattingRules.set('h2', {
        style: {element: 'h2'},
        config: formattingRules.config.addToFormatTags('h2')
    });

    // H3
    formattingRules.set('h3', {
        style: {element: 'h3'},
        config: formattingRules.config.addToFormatTags('h3')
    });

    // H4
    formattingRules.set('h4', {
        style: {element: 'h4'},
        config: formattingRules.config.addToFormatTags('h4')
    });

    // H5
    formattingRules.set('h5', {
        style: {element: 'h5'},
        config: formattingRules.config.addToFormatTags('h5')
    });

    // H6
    formattingRules.set('h6', {
        style: {element: 'h6'},
        config: formattingRules.config.addToFormatTags('h6')
    });

    // Pre
    formattingRules.set('pre', {
        style: {element: 'pre'},
        config: formattingRules.config.addToFormatTags('pre')
    });

    /**
     * Sorted and Unsorted Lists
     */

    // ordered list
    formattingRules.set('ol', {
        command: 'numberedlist',
        config: formattingRules.config.add('NumberedList')
    });

    // Unordered list
    formattingRules.set('ul', {
        command: 'bulletedlist',
        config: formattingRules.config.add('BulletedList')
    });

    // Indent
    formattingRules.set('indent', {
        command: 'indent'
    });

    // Outdent
    formattingRules.set('outdent', {
        command: 'outdent'
    });

    /**
     * Alignment
     */

    // left
    formattingRules.set('left', {
        command: 'justifyleft',
        config: formattingRules.config.add('JustifyLeft')
    });

    // Center
    formattingRules.set('center', {
        command: 'justifycenter',
        config: formattingRules.config.add('JustifyCenter')
    });

    // Right
    formattingRules.set('right', {
        command: 'justifyright',
        config: formattingRules.config.add('JustifyRight')
    });

    // Justify
    formattingRules.set('justify', {
        command: 'justifyblock',
        config: formattingRules.config.add('JustifyBlock')
    });

    /**
     * Tables
     */
    formattingRules.set('table', {
        command: 'table',
        config: formattingRules.config.add('Table')
    });

    /**
     * Remove formatting
     */
    formattingRules.set('removeFormat', {
        command: 'removeFormat'
    });

    /**
     * Links
     */
    formattingRules.set('a', {
        config: formattingRules.config.addToExtraAllowedContent('a[href]'),
        applyStyleFn: (formattingOptions, editor, CKEDITOR) => {
            if (formattingOptions.remove) {
                // We shall remove the link, so we first find it and then remove it; while keeping the contents.
                const selectedLink = CKEDITOR.plugins.link.getSelectedLink(editor);
                if (selectedLink) {
                    selectedLink.remove(true);
                }
            } else {
                const selectedLink = CKEDITOR.plugins.link.getSelectedLink(editor);
                if (selectedLink) {
                    // Link already exists; so we just modify it and set the href.
                    selectedLink.setAttribute('href', formattingOptions.href);
                    selectedLink.setAttribute('data-cke-saved-href', formattingOptions.href);
                } else {
                    // Possibly expand the selection to the parent word
                    formattingRules.expandCollapsedSelectionToCurrentWord(editor, CKEDITOR);

                    // Actually create the link.
                    const style = new CKEDITOR.style({element: 'a', attributes: {href: formattingOptions.href}}); // eslint-disable-line babel/new-cap
                    style.type = CKEDITOR.STYLE_INLINE;
                    editor.applyStyle(style);
                }
            }
        },

        extractCurrentFormatFn: (editor, CKEDITOR) => {
            if (!editor.elementPath()) {
                return false;
            }

            const selectedLink = CKEDITOR.plugins.link.getSelectedLink(editor);
            if (selectedLink) {
                return {
                    href: selectedLink.getAttribute('href')
                };
            }
            return false;
        }
    });

    return formattingRules;
};
