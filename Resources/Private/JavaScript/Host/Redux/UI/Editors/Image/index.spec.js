import {createStore} from 'redux';
import {Map} from 'immutable';
import {reducer, actions, hydrate} from './index.js';

import {handleActions} from 'Shared/Utilities/index';

const {toggleImageDetailsScreen, updateImage} = actions;

describe('"host.redux.ui.editors.image" ', () => {
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

            expect(state.get('ui').get('editors').get('image')).to.be.an.instanceOf(Map);
        });
    });

    describe('"toggleImageDetailsScreen" action.', () => {
        it('should set the screen identifier.', () => {
            store.dispatch(toggleImageDetailsScreen('screen-identifier'));
            expect(store.getState().toJS().ui.editors.image.visibleDetailsScreen).to.equal('screen-identifier');

            store.dispatch(toggleImageDetailsScreen('screen-identifier-2'));
            expect(store.getState().toJS().ui.editors.image.visibleDetailsScreen).to.equal('screen-identifier-2');
        });

        it('should remove the visible screen if called twice with the same identifier.', () => {
            store.dispatch(toggleImageDetailsScreen('screen-identifier'));
            store.dispatch(toggleImageDetailsScreen('screen-identifier'));
            expect(store.getState().toJS().ui.editors.image.visibleDetailsScreen).to.equal(null);
        });
    });

    describe('"updateImage" action.', () => {
        it('should set the transient image.', () => {
            store.dispatch(toggleImageDetailsScreen('screen-identifier'));
            expect(store.getState().toJS().ui.editors.image.visibleDetailsScreen).to.equal('screen-identifier');

            store.dispatch(toggleImageDetailsScreen('screen-identifier-2'));
            expect(store.getState().toJS().ui.editors.image.visibleDetailsScreen).to.equal('screen-identifier-2');
        });

        it('should remove the visible screen if called twice with the same identifier.', () => {
            const image = {
                __this: 'is-an-image'
            };

            store.dispatch(updateImage('/node/contextpath', 'abc-def-uuid', image));
            expect(store.getState().toJS().ui.inspector.valuesByNodePath['/node/contextpath'].images['abc-def-uuid']).to.equal(image);
        });
    });
});
