import {$get} from 'plow-js';
import backend from '@neos-project/neos-ui-backend-connector';

//
// Server storage middleware.
//
// Saves relevant parts of the state to server side session storage on every action
// that matches the "serverSidePersistentActionsPatterns"
//
const serverStorageMiddleware = ({getState}) => {
    let timer = null;
    const debounceLocalStorageTimeout = 100;
    const serverSidePersistentActionsPatterns = [
        '@neos/neos-ui/CR/Nodes/COPY',
        '@neos/neos-ui/CR/Nodes/CUT',
        '@neos/neos-ui/CR/Nodes/PASTE'
    ];

    return next => action => {
        const returnValue = next(action);

        const serverActionMatched = serverSidePersistentActionsPatterns
            .some(pattern => action.type === pattern);
        if (serverActionMatched) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const state = getState();
                // TODO: figure out a more declarative way to manage this
                const persistentStateSubset = {
                    cr: {
                        nodes: {
                            clipboard: $get('cr.nodes.clipboard', state),
                            clipboardMode: $get('cr.nodes.clipboardMode', state)
                        }
                    }
                };
                const {persistState} = backend.get().endpoints;
                persistState(persistentStateSubset);
                timer = null;
            }, debounceLocalStorageTimeout);
        }

        return returnValue;
    };
};

export default serverStorageMiddleware;
