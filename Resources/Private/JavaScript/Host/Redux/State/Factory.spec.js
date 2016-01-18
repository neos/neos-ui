import chai from 'chai';
import Immutable from 'immutable';
import factory from './Factory.js';

const expect = chai.expect;

describe('Global state factory', () => {
    it('should return an instance of a immutable Map.', () => {
        const map = factory();

        expect(map).to.be.an.instanceof(Immutable.Map);
    });

    it('should initially contain the basic structure of the global state.', () => {
        const state = factory().toObject();

        expect(state).to.have.all.keys([
            'ui',
            'user',
            'nodes',
            'changes'
        ]);
        expect(state.ui.toObject()).to.have.all.keys([
            'offCanvas',
            'leftSidebar',
            'rightSidebar',
            'tabs',
            'contextBar',
            'remote',
            'flashMessages',
            'pageTree'
        ]);
        expect(state.user.toObject()).to.have.all.keys([
            'settings',
            'name'
        ]);
        expect(state.user.toObject()).to.have.all.keys([
            'settings',
            'name'
        ]);
        expect(state.nodes.toObject()).to.have.all.keys([
            'byContextPath',
            'selected'
        ]);
    });

    it('should merge the incomming server state with the initial state.', () => {
        const state = factory().toObject();
        const merged = factory({
            ui: {
                offCanvas: {
                    isHidden: false
                }
            }
        }).toObject();

        expect(state.ui.toObject().offCanvas.toObject().isHidden).to.equal(true);
        expect(merged.ui.toObject().offCanvas.toObject().isHidden).to.equal(false);
    });
});
