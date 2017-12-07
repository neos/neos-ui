let _innerReducer = null;

export default class DelegatingReducer {

    reducer() {
        return (state, action) => {
            if (action.type === '@@INIT') {
                return state;
            }
            if (!_innerReducer) {
                console.error(action);
                throw new Error('NO inner reducer supplied so far, but received action just shown');
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
