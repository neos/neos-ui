let _innerReducer = null;

export default class DelegatingReducer {
    reducer() {
        return (state, action) => {
            if (!_innerReducer) {
                return state;
            }
            return _innerReducer(state, action);
        };
    }

    setReducer(reducer) {
        if (_innerReducer) {
            throw new Error('Inner Reducer not allowed to be changed');
        }
        _innerReducer = reducer;
    }
}
