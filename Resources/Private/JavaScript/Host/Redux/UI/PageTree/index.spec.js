import Immutable from 'immutable';
import {createStore} from 'redux';
import {reducer, actions} from './index.js';

const {setData, setSubTree, setNode} = actions;

describe('"host.redux.ui.pageTree" ', () => {
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
            expect(store.getState()).to.be.an.instanceof(Immutable.Map);
        });
    });

    describe('"setData" action.', () => {
        it('should replace the initial state with the given argument.', () => {
            store.dispatch(setData({
                node: {}
            }));

            expect(store.getState().count()).to.equal(1);
            expect(store.getState().get('node')).to.be.an.instanceof(Immutable.Map);
        });
    });

    describe('"setSubTree" action.', () => {
        it('should set the given data as the contents of the given object path.', () => {
            store.dispatch(setData({
                node: {}
            }));

            store.dispatch(setSubTree('node', {
                children: {}
            }));

            expect(store.getState().get('node').get('children')).to.not.be.an('undefined');
            expect(store.getState().get('node').get('children')).to.be.an.instanceof(Immutable.Map);
        });
    });

    describe('"setNode" action.', () => {
        it('should replace the given data as the contents of the given object path.', () => {
            store.dispatch(setData({
                node: {
                    children: {}
                }
            }));

            const data = Immutable.fromJS({
                foo: 'bar'
            });
            store.dispatch(setNode('node', data));

            expect(store.getState().get('node')).to.not.be.an('undefined');
            expect(store.getState().get('node').get('foo')).to.equal('bar');
            expect(store.getState().get('node').get('children')).to.be.an('undefined');
        });

        it('should reset recursivly the "isActive" and "isFocused" states on other nodes', () => {
            store.dispatch(setData({
                node: {
                    isActive: false,
                    isFocused: false
                },
                anotherNode: {
                    children: {
                        deepNode: {
                            isActive: true,
                            isFocused: true
                        }
                    }
                }
            }));

            const data = Immutable.fromJS({
                isActive: true,
                isFocused: true
            });
            store.dispatch(setNode('node', data));

            const node = store.getState().get('node');
            const deepNode = store.getState().get('anotherNode').get('children').get('deepNode');

            expect(node.get('isActive')).to.equal(true);
            expect(node.get('isFocused')).to.equal(true);
            expect(deepNode.get('isActive')).to.equal(false);
            expect(deepNode.get('isActive')).to.equal(false);
        });
    });
});
