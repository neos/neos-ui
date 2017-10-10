const upperFirst = require('lodash.upperfirst');

// Global CSS variables for Neos.Ui
const config = {
    zIndex: {
        flashMessage: '999999',
        linkIconButton: '1000',
        aspectRatioDropdownContents: '10',
        nodeToolBar: '2147483647',
        notInlineEditableOverlay: '10000',
        secondaryInspectorElevated: '10001',
        secondaryInspectorClose: '10',
        drawer: '8000',
        fullScreenClose: '1',
        primaryToolbar: '9999',
        unappliedChangesOverlay: '10000',
        bar: '1',
        checkboxInput: '1',
        calendarFakeInputMirror: '1',
        rdtPicker: '99999 !important',
        dialog: '999',
        dropdownContents: '1',
        wrapperDropdown: '1',
        selectBoxLoadingIcon: '1',
        selectBoxBtnDelete: '1',
        selectBoxContents: '10',
        dropTargetBefore: '1',
        dropTargetAfter: '2'
    }
};

const generateCssVarsObject = (subject = config, predicate = '') => {
    const hasPredicate = predicate && predicate.length;
    let target = {};

    Object.keys(subject).forEach(key => {
        const val = subject[key];
        const camelKey = upperFirst(key);
        const nestedPredicate = hasPredicate ? predicate + camelKey : key;

        if (typeof val === 'object') {
            target = Object.assign(
        {},
        target,
        generateCssVarsObject(val, nestedPredicate)
      );
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
