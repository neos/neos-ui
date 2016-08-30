/* Main Registry Implementation */

class SynchronousRegistry {
    constructor(description) {
        // The description of the registry, containing examples, what is in there.
        this.description = description;

        // internal registry, containing the keys as object keys, and the values being the values in the registry.
        this._registry = {};
        this._keys = [];
    }

    add(key, value) {
        // TODO: implement position in registry!
        // TODO: "key" must be string!
        this._registry[key] = value;
        this._keys.push(key);
    }

    get(key) {
        // TODO: "key" must be string!
        return this._registry[key];
    }

    has(key) {
        // TODO: "key" must be string!
        return this._registry.hasOwnProperty(key);
    }

    getAllAsObject() {
        return Object.assign({}, this._registry);
    }

    getAllAsList() {
        return Object.keys(this._registry).map(key => Object.assign({id: key}, this._registry[key]));
    }
}

class CkEditorToolbarRegistry extends SynchronousRegistry {
    constructor(...args) {
        super(...args);

        this.TRISTATE_DISABLED = 0;
        this.TRISTATE_ON = 1;
        this.TRISTATE_OFF = 2;
    }
}

class CkEditorFormattingRulesRegistry extends SynchronousRegistry {
    constructor(...args) {
        super(...args);

        this.config = {

            /**
             * add a tag name to the CKEditor block-level formatting config "format_tags",
             * and ensure the "Format" selector is visible
             */
            addToFormatTags: tagName =>
                config => {
                    if (config.format_tags) {
                        config.format_tags += ';';
                    } else {
                        config.format_tags = '';
                    }

                    config.format_tags += tagName;

                    config = this.config.add("Format")(config);

                    return config;
                },
            /**
             * adds the given "buttonName" to the list of enabled buttons, i.e. configuring ACF for them correctly
             */
            add: buttonName =>
                config => {
                    if (!config.buttons) {
                        config.buttons = [];
                    }
                    if (config.buttons.indexOf(buttonName) === -1) {
                        config.buttons.push(buttonName);
                    }

                    return config;
                },
        }
    }
}

const registry = {
    ckEditor: {
        formattingRules: new CkEditorFormattingRulesRegistry(`
            Contains the possible styles for CKeditor.

            ## Enabled Styles

            The actual *enabled* styles are determined by the NodeTypes configuration of the property.
            This means, that if the node is configured using NodeTypes \`properties.[propertyName].ui.aloha.formatting.strong=true\`,
            then the "strong" key inside this registry is actually enabled for the editor.

            For backwards compatibility reasons, the formatting-and-styling-registry *KEYS* must match the "pre-React" UI, if they
            existed beforehand.


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

            - \`command\` (string, optional). If specified, this CKEditor command is triggered; so the command string is known by CKeditor
              in the "commands" section: http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-getCommand

            - \`style\` (object, optional). If specified, this CKEditor style is applied. Expects a style description adhering to CKEDITOR.style(...),
              so for example: \`{ style: {element: 'h1'}\`

            - \`config\` (function, optional): This function needs to adjust the CKEditor config to e.g. configure ACF correctly.
              The function gets passed in the config so-far, and needs to return the modified config.
              See "CKEditor Configuration Helpers" below for helper functions.


            ## CKEditor Configuration Helpers

            - \`config: registry.ckEditor.formattingRules.config.addToFormatTags('h1')\`: adds the passed-in tag to the \`format_tags\` configuration
              option of CKEditor.

            - \`registry.ckEditor.formattingRules.config.add('Strong')\`: adds the passed-in *Button Definition Name* to the ACF configuration
              (automatic mode). This means the button names are standard CKEditor config buttons, like "Cut,Copy,Paste,Undo,Redo,Anchor".

        `),

        toolbar: new CkEditorToolbarRegistry(`
            Contains the CKeditor Editing Toolbar components.

            The values are objects of the following form:
                {
                    formatting: 'h1' // References a key inside "formattingRules"
                    component: Button // the React component being used for rendering
                    callbackPropName: 'onClick' // Name of the callback prop of the Component which is fired when the component's value changes.
                    // all other properties are directly passed on to the component.
                }

            ## Component wiring

            - Each toolbar component receives all properties except "formatting" and "component" directly as props.

            - Furthermore, the "isActive" property is bound, which is a boolean flag defining whether the text style
              referenced by "formatting" is currently active or not.

            - Furthermore, the callback specified in "callbackPropName" is wired, which toggles the value.
        `)
    },
    inspector: {
        editors: new SynchronousRegistry(`
            Contain all registered editors.

            The key is an editor name (such as TYPO3.Neos/Inspector/Editors/SelectBoxEditor), and the values are objects of the following form:
                {
                    component: TextInput // the React editor component to use.

                    hasOwnLabel: true|false // does the component render the label internally, or not?
                }

            ## Component Wiring

            Every component gets the following properties (see EditorEnvelope/index.js)

            - identifier: an identifier which can be used for HTML ID generation
            - label: the label
            - node: the current node
            - value: The value to display
            - propertyName: Name of the property to edit (of the node)
            - options: additional editor options
            - commit: a callback function when the content changes.
              - 1st argument: the new value
              - 2nd argument (optional): an object whose keys are to-be-triggered *saveHooks*, and the values are hook-specific options.
                Example: {'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextImage}

        `),
        saveHooks: new SynchronousRegistry(`
            Sometimes, it is needed to run code when the user presses "Apply" inside the Inspector.

            Example: When the user cropped a new image, on Apply, a new imageVariant must be created on the server,
            and then the identity of the new imageVariant must be stored inside the Value of the image.

            The process is as follows:
            - When an editor wants its value to be post-processed, it calls \`props.commit(newValue, {hookName: hookOptions})\`
            - Then, when pressing Apply in the UI, the hookNames are resolved inside this \`saveHooks\` registry.

            ## Hook Definitions

            Every entry inside this registry is a function of the following signature:

            (valueSoFar, hookOptions) => {
                return new value,
                can also return a new Promise.
            }
        `)
    },
    serverFeedbackHandlers: new SynchronousRegistry(`
        Contains all server feedback handlers.

        The key is the server-feedback-handler-type, and the value is a function with the following signature:

        (feedback, store) => {
            // do whatever you like here :-)
        }
    `)
};

export default registry;
