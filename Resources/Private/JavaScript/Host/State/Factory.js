import Immutable from 'immutable';

export default serverState => Immutable.fromJS({
    tabs: {
        byId: {
        },
        active: ''
    },

    documents: {
        byId: {}
    }
}).mergeDeep(Immutable.fromJS(serverState));
