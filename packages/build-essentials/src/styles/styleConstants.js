const upperFirst = require('lodash.upperfirst');

// Global CSS variables for Neos.Ui
const config = {
    spacing: {
        goldenUnit: '40px',
        full: '16px',
        half: '8px',
        quarter: '4px'
    },
    size: {
        sidebarWidth: '320px'
    },
    transition: {
        fast: '.1s',
        default: '.25s',
        slow: '.5s'
    },
    zIndex: {
        secondaryToolbar: ['linkIconButtonFlyout'],
        flashMessageContainer: '6',
        loadingIndicatorContainer: '5',
        secondaryInspector: ['context', 'iframe', 'close'],
        secondaryInspectorElevated: ['context', 'dropdownContents'],
        dialog: ['context'],
        fullScreenClose: ['context'],
        drawer: ['context'],
        bar: ['context'],
        primaryToolbar: '4',
        checkboxInput: ['context'],
        dropdownContents: ['context'],
        selectBoxContents: '4',
        notInlineEditableOverlay: ['context'],
        calendarFakeInputMirror: ['context'],
        rdtPicker: ['context'],
        sideBar: ['dropTargetBefore', 'dropTargetAfter'],
        wrapperDropdown: ['context'],
        unappliedChangesOverlay: ['context'],
        nodeToolBar: '2147483646'
    },
    fontSize: {
        base: '14px',
        small: '12px'
    },
    fonts: {
        headings: {
            family: 'Noto Sans',
            style: 'Regular',
            cssWeight: '400'
        },
        copy: {
            family: 'Noto Sans',
            style: 'Regular',
            cssWeight: '400'
        }
    },
    colors: {
        primaryViolet: '#26224C',
        primaryVioletHover: '#342f5f',
        primaryBlue: '#00ADEE',
        primaryBlueHover: '#35c3f8',
        contrastDarkest: '#141414',
        contrastDarker: '#222',
        contrastDark: '#3f3f3f',
        contrastNeutral: '#323232',
        contrastBright: '#999',
        contrastBrighter: '#adadad',
        contrastBrightest: '#FFF',
        success: '#00a338',
        successHover: '#0bb344',
        warn: '#ff8700',
        warnHover: '#fda23d',
        error: '#ff460d',
        errorHover: '#ff6a3c',
        uncheckedCheckboxTick: '#5B5B5B'
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
                target[`--${predicate}-${camelKey}-${upperFirst(item)}`] = `${index + 1}`;
            });
        } else if (typeof val === 'object') {
            target = Object.assign({}, target, generateCssVarsObject(val, nestedPredicate));
        } else {
            target[`--${predicate}-${camelKey}`] = val;
        }
    });

    return target;
};

module.exports = {
    config,
    generateCssVarsObject
};
