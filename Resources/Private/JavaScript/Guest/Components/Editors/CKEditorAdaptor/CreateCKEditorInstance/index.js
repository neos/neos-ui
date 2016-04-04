import debounce from 'lodash.debounce';

import {handleOutside} from 'Guest/Process/DOMUtils.js';
import {createSignal} from 'Guest/Process/SignalRegistry/index';

const createButtonCreator = (ckApi, editor) => (icon, command) => ({
    type: 'Button',
    options: {
        icon,
        isActive: () => editor.getCommand(command) && editor.getCommand(command).state === ckApi.TRISTATE_ON,
        isEnabled: () => true,
        onClick: createSignal(
            () => editor.execCommand(command)
        )
    }
});

const createDropDown = (...items) => ({
    type: 'DropDown',
    options: {
        items
    }
});

const createDropDownItemCreator = (ckApi, editor) => (icon, label, styleDefinition) => {
    const Style = ckApi.style;
    const style = new Style(styleDefinition);
    const isActive = () => editor.elementPath() && style.checkActive(editor.elementPath(), editor);

    return {
        icon,
        label,
        isActive,
        isEnabled: () => true,
        onSelect: createSignal(
            () => {
                const op = isActive(editor) ? 'removeStyle' : 'applyStyle';

                editor[op](style);
                editor.fire('change');
            }
        )
    };
};

export default (ckApi, editorApi, dom, getSelectionData) => {
    const editor = ckApi.inline(dom, {
        removePlugins: 'toolbar',
        allowedContent: true
    });

    const createButton = createButtonCreator(ckApi, editor);
    const createDropDownItem = createDropDownItemCreator(ckApi, editor);
    const updateToolbarConfiguration = debounce(
        editorApi.registerToolbar({
            components: [
                createDropDown(
                    createDropDownItem('paragraph', 'Paragraph', {element: 'p'}),
                    createDropDownItem('header', 'Headline 1', {element: 'h1'}),
                    createDropDownItem('header', 'Headline 2', {element: 'h2'}),
                    createDropDownItem('header', 'Headline 3', {element: 'h3'}),
                    createDropDownItem('header', 'Headline 4', {element: 'h4'}),
                    createDropDownItem('header', 'Headline 5', {element: 'h5'}),
                    createDropDownItem('header', 'Headline 6', {element: 'h6'}),
                    createDropDownItem('font', 'Preformatted Text', {element: 'pre'})
                ),
                createButton('bold', 'bold'),
                createButton('italic', 'italic'),
                createButton('underline', 'underline'),
                createButton('subscript', 'subscript'),
                createButton('superscript', 'superscript'),
                createButton('strikethrough', 'strike'),
                createButton('list-ol', 'numberedlist'),
                createButton('list-ul', 'bulletedlist'),
                createButton('align-left', 'justifyleft'),
                createButton('align-center', 'justifycenter'),
                createButton('align-right', 'justifyright'),
                createButton('align-justify', 'justifyblock')
            ]
        }),
        100
    );
    const handleUserInteraction = event => {
        if (event.name !== 'keyup' || event.data.$.keyCode !== 27) {
            const selectionData = getSelectionData(editor);

            if (selectionData) {
                const {left, top} = selectionData.region;

                editorApi.setToolbarPosition(left, top);
                updateToolbarConfiguration();

                if (selectionData.isEmpty) {
                    editorApi.hideToolbar();
                } else {
                    editorApi.showToolbar(editor.name);
                }
            }
        }
    };
    const handleEditorBlur = event => {
        const editable = editor.editable();

        editable.removeListener('keyup', handleUserInteraction);
        editable.removeListener('mouseup', handleUserInteraction);

        handleUserInteraction(event);
        editorApi.hideToolbar();
    };
    const handleEditorFocus = event => {
        const editable = editor.editable();

        editable.attachListener(editable, 'keyup', handleUserInteraction);
        editable.attachListener(editable, 'mouseup', handleUserInteraction);

        handleUserInteraction(event);
    };

    editor.once('contentDom', () => {
        const editable = editor.editable();

        editable.attachListener(editable, 'focus', handleEditorFocus);
        handleOutside('click', handleEditorBlur)(editable);
        editor.on('change', () => updateToolbarConfiguration());
    });

    return editor;
};
