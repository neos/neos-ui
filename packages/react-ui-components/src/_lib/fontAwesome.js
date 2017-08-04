export function makeValidateId(icons = {}) {
    const ICON_NAMES = Object.keys(icons);

    return function validateId(id = '') {
        //
        // A list of backward compatible icons
        //
        const backwardCompatibleIcons = {
            'icon-folder-open-alt': 'fa-folder-open-o',
            'icon-envelope-alt': 'fa-envelope-o'
        };

        const tempName = id in backwardCompatibleIcons ? backwardCompatibleIcons[id] :
            (id.startsWith('fa-') ? id : (id.startsWith('icon-') ? id.replace(/^icon/, 'fa') : `fa-${id}`));

        //
        // Automatically prefix the passed id with fa regardless which prefix was passed
        //

        //
        // becuase e.g. picture is called picture-o in FA
        //
        const nameWithSuffix = `${tempName}-o`;
        const isValid = ICON_NAMES.includes(tempName) || ICON_NAMES.includes(nameWithSuffix);
        const name = ICON_NAMES.includes(tempName) ? tempName : nameWithSuffix;

        return {
            isValid,
            iconName: isValid ? name : null
        };
    };
}

export function makeGetClassName(icons = {}) {
    const validateId = makeValidateId(icons);

    return function getClassName(id = '') {
        return icons[validateId(id).iconName];
    };
}
