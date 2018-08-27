import {AnyAction} from 'redux';
//
// Handle redux actions
//

// TODO: Don't know how to type this propertly yet
interface Handler {
    (payload?: any): any
}

interface Handlers {
    [index: string]: Handler,
    [index: number]: Handler
}

const handleActions = (handlers: Handlers = {}) => <S>(state: S, action: AnyAction): S => {
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
