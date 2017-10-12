const upperFirst = require('lodash.upperfirst');

// Global CSS variables for Neos.Ui
const config = {
    zIndex: {
        secondaryToolbar: {
            linkIconButtonFlyout: '1'
        },
        flashMessageContainer: {
            context: '1'
        },
        secondaryInspector: {
            context: '1',
            close: '2'
        },
        secondaryInspectorElevated: {
            context: '1',
            dropdownContents: '2'
        },
        dialog: {
            context: '1'
        },
        fullScreenClose: {
            context: '1'
        },
        drawer: {
            context: '1'
        },
        bar: {
            context: '1'
        },
        primaryToolbar: {
            context: '1'
        },
        checkboxInput: {
            context: '1'
        },
        dropdownContents: {
            context: '1'
        },
        selectBoxContents: {
            context: '1'
        },
        selectBoxLoadingIcon: {
            context: '1'
        },
        selectBoxBtnDelete: {
            context: '1'
        },
        notInlineEditableOverlay: {
            context: '1'
        },
        calendarFakeInputMirror: {
            context: '1'
        },
        rdtPicker: {
            context: '1'
        },
        sideBar: {
            dropTargetBefore: '1',
            dropTargetAfter: '2'
        },
        wrapperDropdown: {
            context: '1'
        },
        flashMessage: '999999', //
        linkIconButton: '1000', //
        aspectRatioDropdownContents: '10', // secondaryInspectorElevated.dropdownContents
        nodeToolBar: '2147483647',
        notInlineEditableOverlay: '10000', // notInlineEditableOverlay.context
        secondaryInspectorElevated: '10001', // secondaryInspectorElevated.context
        secondaryInspectorClose: '10', // secondaryInspector.close
        drawer: '8000', // drawer.context
        fullScreenClose: '1', // fullScreenClose.context
        primaryToolbar: '9999', // primaryToolbar.context
        unappliedChangesOverlay: '10000',
        bar: '1', // bar.context
        checkboxInput: '1', // checkoboxInput.context
        calendarFakeInputMirror: '1', // calendarFakeInputMirror.context
        rdtPicker: '99999 !important', // rdtPicker.context
        dialog: '999', // dialog.context
        dropdownContents: '1', // dropdownContents.context
        wrapperDropdown: '1', //
        selectBoxLoadingIcon: '1', // selectBoxLoadingIcon.context
        selectBoxBtnDelete: '1', //
        selectBoxContents: '10', // selectBoxContents.context
        dropTargetBefore: '1', // sideBar.dropTargetBefore
        dropTargetAfter: '2' // sidebar.dropTargetAfter
    }
};

const generateCssVarsObject = (subject = config, predicate = '') => {
    const hasPredicate = predicate && predicate.length;
    let target = {};

    Object.keys(subject).forEach(key => {
        const val = subject[key];
        const camelKey = upperFirst(key);
        const nestedPredicate = hasPredicate ? predicate + camelKey : key;

        if (Array.isArray(val)) {
            val.forEach((item, index) => {
                target[`--${predicate}${camelKey}${upperFirst(item)}`] = `${index + 1}`;
            });
        } else if (typeof val === 'object') {
            target = Object.assign({}, target, generateCssVarsObject(val, nestedPredicate));
        } else {
            target[`--${predicate}${camelKey}`] = val;
        }
    });

    return target;
};

module.exports = {
    config,
    generateCssVarsObject
};
