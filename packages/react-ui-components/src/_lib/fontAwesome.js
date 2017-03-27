export function makeValidateId(icons = {}) {
    const ICON_NAMES = Object.keys(icons);

    return function validateId(id = '') {
        //
        // Automatically prefix the passed id with fa regardless which prefix was passed
        //
        const name = id.startsWith('fa-') ? id : (id.startsWith('icon-') ? id.replace(/^icon/, 'fa') : `fa-${id}`);

        const isValid = ICON_NAMES.includes(name);

        return {
            isValid,
            iconName: name
        };
    };
}

export function makeGetClassName(icons = {}) {
    const validateId = makeValidateId(icons);

    return function getClassName(id = '') {
        return icons[validateId(id).iconName];
    };
}
