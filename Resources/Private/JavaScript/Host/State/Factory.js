import Immutable, { Set } from 'immutable';

export default (serverState) => {
    return Immutable.fromJS({
        tabs: {
            byId: {
            },
            active: ''
        },

        documents: {
            byId: {}
        }
    }).mergeDeep(Immutable.fromJS(serverState));
};
