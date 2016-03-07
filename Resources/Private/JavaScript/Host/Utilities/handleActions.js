//
// Handle redux actions
//
const handleActions = handlers => (state, action) =>
    handlers[action.type] ? handlers[action.type](action.payload)(state) : state;

export default handleActions;
