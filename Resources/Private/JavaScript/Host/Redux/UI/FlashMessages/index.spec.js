import {createStore} from 'redux';

import {handleActions} from 'Host/Util/HandleActions/';

import {reducer, actions, initialState} from './index.js';

const {add, remove} = actions;

describe('"host.redux.ui.flashMessages" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                ui: {
                    flashMessages: initialState
                }
            }
        );

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('reducer.', () => {
        it('should return an object as the initial state.', () => {
            const state = store.getState();

            expect(state.ui.flashMessages).to.be.an('object');
        });
    });

    describe('"add" action.', () => {
        it('should be able to add the passed data as a new flashMessage item.', () => {
            store.dispatch(add('myMessageId', 'myMessage', 'error', 300));

            const addedMessage = store.getState().ui.flashMessages.myMessageId;

            expect(addedMessage).not.to.be.an('undefined');
            expect(addedMessage).to.deep.equal({
                severity: 'error',
                id: 'myMessageId',
                message: 'myMessage',
                timeout: 300
            });
        });

        it('should normalize the severity to lowercase for the new flashMessage item.', () => {
            store.dispatch(add('myMessageId1', 'myMessage', 'Error', 300));
            store.dispatch(add('myMessageId2', 'myMessage', 'ERROR', 300));
            store.dispatch(add('myMessageId3', 'myMessage', 'eRrOr', 300));

            const addedMessage1 = store.getState().ui.flashMessages.myMessageId1;
            const addedMessage2 = store.getState().ui.flashMessages.myMessageId2;
            const addedMessage3 = store.getState().ui.flashMessages.myMessageId3;

            expect(addedMessage1.severity).to.equal('error');
            expect(addedMessage2.severity).to.equal('error');
            expect(addedMessage3.severity).to.equal('error');
        });

        it('should set a default timeout of "0" if none was passed for the new flashMessage item.', () => {
            store.dispatch(add('myMessageId', 'myMessage', 'Error'));

            const addedMessage = store.getState().ui.flashMessages.myMessageId;

            expect(addedMessage.timeout).to.equal(0);
        });
    });

    describe('"remove" action.', () => {
        it('should be able to remove an added flashMessage item for the passed key.', () => {
            const countBefore = Object.keys(store.getState().ui.flashMessages).length;

            store.dispatch(add('myMessageId', 'myMessage', 'Error'));

            expect(Object.keys(store.getState().ui.flashMessages).length).to.equal(countBefore + 1);

            store.dispatch(remove('myMessageId'));

            console.log(store.getState().ui.flashMessages);

            expect(Object.keys(store.getState().ui.flashMessages).length).to.equal(countBefore);
        });
    });
});
