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

    getAllAsObject() {
        return Object.assign({}, this._registry);
    }

    getAllAsList() {
        return Object.keys(this._registry).map(key => this._registry[key]);
    }
}

const registry = {
    ckEditor: {
        formattingAndStyling: new SynchronousRegistry(`
            Contains an object either of the form:
                h1: { style: {element: 'h1'} }
                which is compatible to CKEDITOR.style:
                http://docs.ckeditor.com/#!/api/CKEDITOR.style
            ... or of the form:
                bold: { command: 'bold' }
                where the command string is known by CKeditor in the "commands" section:
                http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-getCommand
        `),

        toolbar: new SynchronousRegistry(`
            Contains the CKeditor Editing Toolbar components.

            The values are objects of the following form:
                {
                    formatting: 'h1' // References a key inside "formattingAndStyling"
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
    }
};

export default registry;
