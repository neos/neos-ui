//
// Handle redux actions
//
const handleActions = (handlers = {}) => (state, action) => {
    if (Array.isArray(handlers)) {
        return handlers.reduce((state, handler) => handler(state, action), state);
    }

    const handler = handlers[action.type];

    if (handler) {
        return handler(action.payload)(state);
    }

    return state;
};

export default handleActions;
