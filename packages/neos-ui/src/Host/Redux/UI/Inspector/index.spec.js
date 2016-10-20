import {createStore} from 'redux';
import {Map} from 'immutable';

import {reducer, actions, hydrate} from './index.js';

import {handleActions} from '@neos-project/utils-redux';

const {writeValue, cancel} = actions;

describe('"host.redux.ui.inspector" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            hydrate({})(new Map())
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

            expect(state.get('ui').get('inspector')).to.be.an.instanceOf(Map);
        });
    });

    describe('"writeValue" action.', () => {
        it('should store the last modification.', () => {
            store.dispatch(writeValue('/my/path@user-foo', 'test', 'value'));
            expect(store.getState().toJS().ui.inspector.valuesByNodePath['/my/path@user-foo'].nodeProperties.test).to.equal('value');

            store.dispatch(writeValue('/my/path@user-foo', 'test', 'new value'));
            expect(store.getState().toJS().ui.inspector.valuesByNodePath['/my/path@user-foo'].nodeProperties.test).to.equal('new value');
        });
    });

    describe('"cancel" action.', () => {
        it('should cancel all modifications.', () => {
            store.dispatch(writeValue('/my/path@user-foo', 'test', 'value'));
            expect(store.getState().toJS().ui.inspector.valuesByNodePath['/my/path@user-foo'].nodeProperties.test).to.equal('value');

            store.dispatch(cancel('/my/path@user-foo'));
            expect(store.getState().toJS().ui.inspector.valuesByNodePath['/my/path@user-foo']).to.equal(undefined);
        });
    });
});
