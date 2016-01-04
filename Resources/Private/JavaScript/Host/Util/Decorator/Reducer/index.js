export default reducerClass => (state, action) => reducerClass.prototype[action.type](state, action);
