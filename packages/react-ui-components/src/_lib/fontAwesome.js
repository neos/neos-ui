export function makeValidateId(icons = {}) {
    const ICON_NAMES = Object.keys(icons);

    return function validateId(id = '') {
        //
        // Automatically prefix the passed id with fa regardless which prefix was passed
        //
        const name = id.indexOf('fa-') === 0 ? id : (id.indexOf('icon-') === 0 ? id.replace(/^icon/, 'fa') : `fa-${id}`);

        const isValid = ICON_NAMES.includes(name);

        if (isValid) {
            return {
                isValid,
                iconName: name
            };
        }
    };
}

export function makeGetClassName(icons = {}) {
    const validateId = makeValidateId(icons);

    return function getClassName(id = '') {
        return icons[validateId(id).iconName];
    };
}
