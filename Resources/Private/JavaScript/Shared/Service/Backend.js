const BACKEND_GLOBAL_IDENTIFIER = '@Neos.Neos.Ui:BackendServices';

export default windowObject => {
    if (!windowObject[BACKEND_GLOBAL_IDENTIFIER]) {
        windowObject[BACKEND_GLOBAL_IDENTIFIER] = {};
    }

    return windowObject[BACKEND_GLOBAL_IDENTIFIER];
};
