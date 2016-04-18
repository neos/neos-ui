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
    const createButton = (icon, format, isEnabled) => ({
        type: 'Button',
        isEnabled,
        options: {
            icon,
            isActive: () => ckApi.isFormatActive(editor, format),
            onClick: createSignal(
                () => ckApi.toggleFormat(editor, format)
            )
        }
    });

    //
    // Creates a drop down configuration
    //
    const createDropDown = (...items) => ({
        type: 'DropDown',
        isEnabled: items.filter(item => item.isEnabled).length > 0,
        options: {
            items
        }
    });

    //
    // Creates a drop down item configuration
    //
    const createDropDownItem = (icon, label, format, isEnabled) => ({
        icon,
        label,
        isEnabled,
        isActive: ckApi.isFormatActive(editor, format),
        onSelect: createSignal(
            () => ckApi.toggleFormat(editor, format)
        )
    });

    return {
        createToolbar,
        createButton,
        createDropDown,
        createDropDownItem
    };
};
