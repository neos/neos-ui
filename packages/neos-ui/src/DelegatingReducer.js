let _innerReducer = null;

export default class DelegatingReducer {

    reducer() {
        return (state, action) => {
            if (action.type === '@@INIT' || action.type === '@@redux/INIT') {
                return state;
            }
            if (!_innerReducer) {
                throw new Error('NO inner reducer supplied so far, but received action ' + action.type);
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
