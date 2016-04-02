import {createStore} from 'redux';
import {Map} from 'immutable';

import {reducer, actions, hydrate} from './index.js';

import {handleActions} from 'Shared/Utilities/index';

const {add, remove} = actions;

describe('"host.redux.ui.flashMessages" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            hydrate({})(new Map)
        );

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('reducer.', () => {
        it('should return an Immutable.Map as the initial state.', () => {
            const state = store.getState();

            expect(state.get('ui').get('flashMessages')).to.be.an.instanceOf(Map);
        });
    });

    describe('"add" action.', () => {
        it('should throw an error if no arguments where passed.', () => {
            const fn = () => store.dispatch(add());

            expect(fn).to.throw('Empty or non existent "id" passed to the addFlashMessage reducer.');
        });

        it('should throw an error no "message" was passed.', () => {
            const fn = () => store.dispatch(add('myMessageId', null));

            expect(fn).to.throw('Empty or non existent "message" passed to the addFlashMessage reducer.');
        });

        it('should throw an error if an invalid "severity" was passed.', () => {
            const fn = () => store.dispatch(add('myMessageId', 'myMessage', null));

            expect(fn).to.throw('Invalid "severity" specified while adding a new FlashMessage.');
        });

        it('should be able to add the passed data as a new flashMessage item.', () => {
            store.dispatch(add('myMessageId', 'myMessage', 'error', 300));

            const addedMessage = store.getState().get('ui').get('flashMessages').get('myMessageId');

            expect(addedMessage).not.to.be.an('undefined');
            expect(addedMessage).to.be.an.instanceOf(Map);
            expect(addedMessage.toJS()).to.deep.equal({
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

            const addedMessage1 = store.getState().get('ui').get('flashMessages').get('myMessageId1');
            const addedMessage2 = store.getState().get('ui').get('flashMessages').get('myMessageId2');
            const addedMessage3 = store.getState().get('ui').get('flashMessages').get('myMessageId3');

            expect(addedMessage1.get('severity')).to.equal('error');
            expect(addedMessage2.get('severity')).to.equal('error');
            expect(addedMessage3.get('severity')).to.equal('error');
        });

        it('should set a default timeout of "0" if none was passed for the new flashMessage item.', () => {
            store.dispatch(add('myMessageId', 'myMessage', 'Error'));

            const addedMessage = store.getState().get('ui').get('flashMessages').get('myMessageId');

            expect(addedMessage.get('timeout')).to.equal(0);
        });
    });

    describe('"remove" action.', () => {
        it('should be able to remove an added flashMessage item for the passed key.', () => {
            const countBefore = store.getState().get('ui').get('flashMessages').count();

            store.dispatch(add('myMessageId', 'myMessage', 'Error'));

            expect(store.getState().get('ui').get('flashMessages').count()).to.equal(countBefore + 1);

            store.dispatch(remove('myMessageId'));

            expect(store.getState().get('ui').get('flashMessages').count()).to.equal(countBefore);
        });
    });
});
