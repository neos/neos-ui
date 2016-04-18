import {createSignal} from 'Guest/Process/SignalRegistry/index';
import ckApi from '../../API/index';

export default editor => {
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
            isActive: () => ckApi.isFormatActive(editor, {command}),
            isEnabled: () => true,
            onClick: createSignal(
                () => ckApi.toggleFormat(editor, {command})
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
    const createDropDownItem = (icon, label, style) => ({
        icon,
        label,
        isActive: ckApi.isFormatActive(editor, {style}),
        isEnabled: () => true,
        onSelect: createSignal(
            () => ckApi.toggleFormat(editor, {style})
        )
    });

    //
    // Creates a command drop down item configuration
    //
    const createCommandDropDownItem = (icon, label, command) => ({
        icon,
        label,
        isActive: ckApi.isFormatActive(editor, {command}),
        isEnabled: () => true,
        onSelect: createSignal(
            () => ckApi.toggleFormat(editor, {command})
        )
    });

    return {
        createToolbar,
        createButton,
        createDropDown,
        createDropDownItem,
        createCommandDropDownItem
    };
};
