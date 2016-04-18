import {createSignal} from 'Guest/Process/SignalRegistry/index';

export default (ckApi, editor) => {
    //
    // Creates a toolbar configuration
    //
    const createToolbar = (...components) => ({
        components
    });

    //
    // Creates a button configuration
    //
    const createButton = (icon, command) => ({
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

    //
    // Creates a drop down configuration
    //
    const createDropDown = (...items) => ({
        type: 'DropDown',
        options: {
            items
        }
    });

    //
    // Creates a drop down item configuration
    //
    const createDropDownItem = (icon, label, styleDefinition) => {
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

    //
    // Creates a command drop down item configuration
    //
    const createCommandDropDownItem = (icon, label, command) => {
        return {
            icon,
            label,
            isActive: () => editor.getCommand(command) && editor.getCommand(command).state === ckApi.TRISTATE_ON,
            isEnabled: () => true,
            onSelect: createSignal(
                () => {
                    editor.execCommand(command);
                    editor.fire('change');
                }
            )
        };
    };

    return {
        createToolbar,
        createButton,
        createDropDown,
        createDropDownItem,
        createCommandDropDownItem
    };
};
