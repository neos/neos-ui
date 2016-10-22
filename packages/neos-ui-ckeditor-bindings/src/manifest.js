import {manifest} from '@neos-project/neos-ui-extensibility';
import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import CkEditorFormattingRulesRegistry from './registry/CkEditorFormattingRulesRegistry';

manifest('@neos-project/neos-ui-ckeditor-bindings', {}, globalRegistry => {
    const ckEditorRegistry = globalRegistry.add(
        '@neos-project/neos-ui-ckeditor-bindings',
        new SynchronousMetaRegistry(`
            # Registries for CK Editor

            - formattingRules for connecting with the toolbar
        `)
    );

    const formattingRules = ckEditorRegistry.add('formattingRules', new CkEditorFormattingRulesRegistry(`
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
          correctly. The function gets passed in the config so-far, and needs to return the modified config. See
          "CKEditor Configuration Helpers" below for helper functions.

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
    formattingRules.add('strong', {
        command: 'bold',
        config: formattingRules.config.add('Bold')
    });

    // Italic
    formattingRules.add('em', {
        command: 'italic',
        config: formattingRules.config.add('Italic')
    });

    // Underline
    formattingRules.add('u', {
        command: 'underline',
        config: formattingRules.config.add('Underline')
    });

    // Subscript
    formattingRules.add('sub', {
        command: 'subscript',
        config: formattingRules.config.add('Subscript')
    });

    // Superscript
    formattingRules.add('sup', {
        command: 'superscript',
        config: formattingRules.config.add('Superscript')
    });

    // Strike-Through
    formattingRules.add('del', {
        command: 'strike',
        config: formattingRules.config.add('Strike')
    });

    /**
     * Basic Paragraph Styles (p, h1, h2, pre, ...)
     */

    // p tag
    formattingRules.add('p', {
        style: {element: 'p'},
        config: formattingRules.config.addToFormatTags('p')
    });

    // h1
    formattingRules.add('h1', {
        style: {element: 'h1'},
        config: formattingRules.config.addToFormatTags('h1')
    });

    // h2
    formattingRules.add('h2', {
        style: {element: 'h2'},
        config: formattingRules.config.addToFormatTags('h2')
    });

    // h3
    formattingRules.add('h3', {
        style: {element: 'h3'},
        config: formattingRules.config.addToFormatTags('h3')
    });

    // h4
    formattingRules.add('h4', {
        style: {element: 'h4'},
        config: formattingRules.config.addToFormatTags('h4')
    });

    // h5
    formattingRules.add('h5', {
        style: {element: 'h5'},
        config: formattingRules.config.addToFormatTags('h5')
    });

    // h6
    formattingRules.add('h6', {
        style: {element: 'h6'},
        config: formattingRules.config.addToFormatTags('h6')
    });

    // pre
    formattingRules.add('pre', {
        style: {element: 'pre'},
        config: formattingRules.config.addToFormatTags('pre')
    });

    /**
     * Sorted and Unsorted Lists
     */

    // ordered list
    formattingRules.add('ol', {
        command: 'numberedlist',
        config: formattingRules.config.add('NumberedList')
    });

    // unordered list
    formattingRules.add('ul', {
        command: 'bulletedlist',
        config: formattingRules.config.add('BulletedList')
    });

    // Indent
    formattingRules.add('indent', {
        command: 'indent'
    });

    // Outdent
    formattingRules.add('outdent', {
        command: 'outdent'
    });

    /**
     * Tables
     */
    formattingRules.add('table', {
        command: 'table',
        config: formattingRules.config.add('Table')
    });

    /**
     * Remove formatting
     */
    formattingRules.add('removeFormat', {
        command: 'removeFormat'
    });
});
