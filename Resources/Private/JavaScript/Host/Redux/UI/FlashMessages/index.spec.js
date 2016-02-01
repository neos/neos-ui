import Immutable from 'immutable';
import {createStore} from 'redux';
import {reducer, actions} from './index.js';

const {add, remove} = actions;

describe('"host.redux.ui.flashMessages" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(reducer);

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('reducer.', () => {
        it('should return a immutable map as the initial state.', () => {
            const state = store.getState();

            expect(state).to.be.an.instanceof(Immutable.Map);
        });
    });

    describe('"add" action.', () => {
        it('should be able to add the passed data as a new flashMessage item.', () => {
            store.dispatch(add('myMessageId', 'myMessage', 'error', 300));

            const addedMessage = store.getState().get('myMessageId');

            expect(addedMessage).not.to.be.an('undefined');
        });

        it('should create a immutable map for the new flashMessage item.', () => {
            const countBefore = store.getState().count();

            store.dispatch(add('myMessageId', 'myMessage', 'error', 300));

            const state = store.getState();
            const addedMessage = state.get('myMessageId');

            expect(state.count()).to.equal(countBefore + 1);
            expect(addedMessage).to.be.an.instanceof(Immutable.Map);
        });

        it('should normalize the severity to lowercase for the new flashMessage item.', () => {
            store.dispatch(add('myMessageId', 'myMessage', 'Error', 300));

            const addedMessage = store.getState().get('myMessageId');

            expect(addedMessage.get('severity')).to.equal('error');
        });

        it('should set a default timeout of "0" if none was passed for the new flashMessage item.', () => {
            store.dispatch(add('myMessageId', 'myMessage', 'Error'));

            const addedMessage = store.getState().get('myMessageId');

            expect(addedMessage.get('timeout')).to.equal(0);
        });
    });

    describe('"remove" action.', () => {
        it('should be able to remove an added flashMessage item for the passed key.', () => {
            const countBefore = store.getState().count();

            store.dispatch(add('myMessageId', 'myMessage', 'Error'));
            store.dispatch(remove('myMessageId'));

            expect(store.getState().count()).to.equal(countBefore);
        });
    });
});
