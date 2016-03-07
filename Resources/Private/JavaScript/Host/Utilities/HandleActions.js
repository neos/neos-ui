//
// Handle redux actions
//
const handleActions = (handlers = {}) => (state, action) => {
    const handler = handlers[action.type];

    if (handler) {
        return handler(action.payload)(state);
    }

    return state;
};

export default handleActions;
