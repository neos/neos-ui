const BACKEND_GLOBAL_IDENTIFIER = '@Neos.Neos.Ui:BackendServices';

//
// Creates/retrieves a singleton of the backend services on the given context.
//
export default context => {
    if (!context[BACKEND_GLOBAL_IDENTIFIER]) {
        context[BACKEND_GLOBAL_IDENTIFIER] = {};
    }

    return context[BACKEND_GLOBAL_IDENTIFIER];
};
