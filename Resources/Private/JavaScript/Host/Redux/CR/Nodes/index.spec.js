import {createStore} from 'redux';
import {Map} from 'immutable';

import {reducer, actions, hydrate} from './index.js';

import {handleActions} from 'Shared/Utilities/index';

const {add} = actions;

describe('"host.redux.transient.nodes" ', () => {
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

    describe('hydrate.', () => {
        it('should deliver a valid initial state.', () => {
            const state = store.getState();

            expect(state.get('cr').get('nodes')).to.be.an.instanceOf(Map);
            expect(state.get('cr').get('nodes').get('byContextPath')).to.be.an.instanceOf(Map);
            expect(state.get('cr').get('nodes').get('siteNode')).to.be.a('string');
            expect(state.get('cr').get('nodes').get('focused')).to.be.an.instanceOf(Map);
            expect(state.get('cr').get('nodes').get('focused').get('contextPath')).to.be.a('string');
            expect(state.get('cr').get('nodes').get('focused').get('typoscriptPath')).to.be.a('string');
            expect(state.get('cr').get('nodes').get('hovered')).to.be.an.instanceOf(Map);
            expect(state.get('cr').get('nodes').get('hovered').get('contextPath')).to.be.a('string');
            expect(state.get('cr').get('nodes').get('hovered').get('typoscriptPath')).to.be.a('string');
        });

        it('should take cr.nodes.byContextPath from the server state.', () => {
            const store = createStore(
                handleActions(reducer),
                hydrate({
                    cr: {
                        nodes: {
                            byContextPath: {
                                someContextPath: {
                                    some: 'property'
                                }
                            }
                        }
                    }
                })(new Map())
            );
            const state = store.getState();

            expect(state.get('cr').get('nodes').get('byContextPath')).to.be.an.instanceOf(Map);
            expect(state.get('cr').get('nodes').get('byContextPath').get('someContextPath')).not.to.be.an('undefined');
            expect(state.get('cr').get('nodes').get('byContextPath').toJS()).to.deep.equal({
                someContextPath: {
                    some: 'property'
                }
            });
        });

        it('should take cr.nodes.siteNode from the server state.', () => {
            const store = createStore(
                handleActions(reducer),
                hydrate({
                    cr: {
                        nodes: {
                            siteNode: 'theSiteNode'
                        }
                    }
                })(new Map())
            );
            const state = store.getState();

            expect(state.get('cr').get('nodes').get('siteNode')).to.equal('theSiteNode');
        });
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
