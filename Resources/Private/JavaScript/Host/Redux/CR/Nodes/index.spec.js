import {createStore} from 'redux';
import {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';

import {reducer, actions, hydrate} from './index.js';

const {add} = actions;

describe('"host.redux.transient.nodes" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            hydrate({})({})
        );

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('hydrate.', () => {
        it('should take cr.nodes.byContextPath from the server state.');
        it('should take cr.nodes.siteNode from the server state.');
        it('should deliver a vlid initial state.');
    });

    describe('"add" action.', () => {
        it('should add the passed data as a new node item to the "byContextPath" state.', () => {
            const contextPath = '/path/top/my/node@user-username;language=en_US';

            store.dispatch(add(contextPath, {
                foo: 'bar'
            }));

            const addedItem = store.getState().get('cr').get('nodes').get('byContextPath').get(contextPath);

            expect(addedItem).to.not.be.an('undefined');
            expect(addedItem).to.be.an.instanceOf(Map);
            expect(addedItem.toJS()).to.deep.equal({
                foo: 'bar'
            });
        });
    });
});
