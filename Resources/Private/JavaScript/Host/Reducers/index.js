import * as UI from './UI/';
import * as Transient from './Transient/';

const reducerIndex = [
    UI.Tabs,
    UI.Remote,
    UI.LeftSideBar,
    UI.OffCanvas,
    UI.RightSideBar,
    UI.FlashMessages,
    Transient.Nodes,
    Transient.Changes
];

function reducerFactory(actionHandler) {
    return (state, action) => {
        if (state && actionHandler[action.type]) {
            return actionHandler[action.type](state, action);
        }

        return state;
    };
}

export default initialState =>
    (state = initialState, action) =>
        reducerIndex.reduce((prev, cur) =>
            reducerFactory(cur)(prev, action), state);
