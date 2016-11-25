const NotEmpty = value => {
    if (value === null || value === '' || value === []) {
        return 'content.inspector.validators.notEmptyValidator.isEmpty';
    }
};

export default NotEmpty;
