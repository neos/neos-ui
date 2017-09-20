export function makeValidateId(icons = {}) {
    const ICON_NAMES = Object.keys(icons);

    return function validateId(id = '') {
        let iconClassesArray = [id];

        if (id.includes(' ')) {
            iconClassesArray = id.split(' ');
        }

        //
        // A list of backward compatible icons
        //
        const backwardCompatibleIcons = {
            'icon-folder-open-alt': 'fa-folder-open-o',
            'icon-envelope-alt': 'fa-envelope-o'
        };

        const processedIcons = iconClassesArray.map(iconClass => {
            //
            // Automatically prefix the passed iconId with fa regardless which prefix was passed
            //
            const tempName = iconClass in backwardCompatibleIcons ? backwardCompatibleIcons[iconClass] :
                (iconClass.startsWith('fa-') ? iconClass : (iconClass.startsWith('icon-') ? iconClass.replace(/^icon/, 'fa') : `fa-${iconClass}`));

            //
            // becuase e.g. picture is called picture-o in FA
            //
            const nameWithSuffix = `${tempName}-o`;
            const isValid = ICON_NAMES.includes(tempName) || ICON_NAMES.includes(nameWithSuffix);
            const name = ICON_NAMES.includes(tempName) ? tempName : nameWithSuffix;

            return {
                isValid,
                iconName: isValid ? name : iconClass
            };
        });

        const amountOfValidIcons = processedIcons.filter(icon => {
            return icon.isValid;
        }).length;

        const faIconName = processedIcons.reduce((acc, curr) => {
            if (curr.isValid) {
                return curr.iconName;
            }
            return acc;
        }, null);

        return {
            isValid: amountOfValidIcons === 1,
            iconName: faIconName,
            additionalCssClasses: processedIcons.filter(icon => !icon.isValid).map(icon => icon.iconName).join(' ')
        };
    };
}

export function makeGetClassName(icons = {}) {
    const validateId = makeValidateId(icons);

    return function getClassName(id = '') {
        const classes = validateId(id);
        if (classes.isValid) {
            return `${icons[classes.iconName]} ${classes.additionalCssClasses}`.trim();
        }
    };
}
