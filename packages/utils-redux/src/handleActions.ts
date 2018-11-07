//
// Handle redux actions
//
const handleActions = (handlers: any = {}) => (state: any, action: any) => {
    if (Array.isArray(handlers)) {
        return handlers.reduce((currentState, innerHandler) => innerHandler(currentState, action), state);
    }

    const handler = handlers[action.type];

    if (handler) {
        return handler(action.payload)(state);
    }

    return state;
};

export default handleActions;
