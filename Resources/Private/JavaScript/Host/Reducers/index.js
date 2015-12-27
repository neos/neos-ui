import UI from './UI';
import Transient from './Transient';

const reducerIndex = [
    UI.Tabs,

    Transient.Documents
];

function reducerFactory (actionHandler) {
    return (state, action) => {
        if (state && actionHandler[action.type]) {
            return actionHandler[action.type](state, action);
        }

        return state;
    };
}

export default (initialState) => {
    return (state = initialState, action) => {
        return reducerIndex.reduce((prev, cur) => reducerFactory(cur)(prev, action), state);
    };
};
