import chai, {expect} from 'chai';
import sinon from 'sinon/pkg/sinon.js';
import sinonChai from 'sinon-chai';
import handleActions from './HandleActions.js';

chai.should();
chai.use(sinonChai);

describe('"host.utilities.handleActions" ', () => {
    it('should return a curry function when called.', () => {
        expect(handleActions()).to.be.an('function');
    });

    it('should check if the passed handlers contain the given action object name and return the state if none was found.', () => {
        const handler = handleActions();
        const state = {};
        const action = {
            type: 'test'
        };

        expect(handler(state, action)).to.equal(state);
    });

    it('should call the associated handler of the action type with the payload and the returned curry function with the state.', () => {
        const actionReducer = sinon.spy();
        const handlers = {
            test: sinon.spy(() => actionReducer)
        };
        const handler = handleActions(handlers);
        const state = {};
        const action = {
            type: 'test',
            payload: {}
        };

        handler(state, action);

        expect(handlers.test).to.have.callCount(1);
        expect(handlers.test).to.have.been.calledWith(action.payload);

        expect(actionReducer).to.have.callCount(1);
        expect(actionReducer).to.have.been.calledWith(state);
    });
});
