const BACKEND_GLOBAL_IDENTIFIER = '@PackageFactroy.Guevara:BackendServices';

export default (windowObject) => {
    if (!windowObject[BACKEND_GLOBAL_IDENTIFIER]) {
        windowObject[BACKEND_GLOBAL_IDENTIFIER] = {};
    }

    return windowObject[BACKEND_GLOBAL_IDENTIFIER];
};
