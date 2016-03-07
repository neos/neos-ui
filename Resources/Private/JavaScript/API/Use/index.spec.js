import chai, {expect} from 'chai';
import sinon from 'sinon/pkg/sinon.js';
import sinonChai from 'sinon-chai';
import initializeUse from './index.js';

chai.should();
chai.use(sinonChai);

describe.only('Neos JS API > use', () => {
    it('should return a function when called', () => {
        expect(initializeUse()).to.be.an('function');
    });

    it('should call the "addLibrary" function when initializing a plugin factory called', () => {
        const apiTarget = {};
        const addLibrary = sinon.spy();
        const use = initializeUse(addLibrary, apiTarget);
        const pluginFactory = () => {};
        pluginFactory.identifier = 'myPlugin';

        use(pluginFactory);

        expect(addLibrary).to.have.callCount(1);
        expect(addLibrary).to.have.been.calledWith('myPlugin', pluginFactory());
    });

    it('should call the "pluginFactory" when initializing a plugin factory called', () => {
        const apiTarget = {};
        const addLibrary = () => {};
        const use = initializeUse(addLibrary, apiTarget);
        const pluginFactory = sinon.spy();
        pluginFactory.identifier = 'myPlugin';

        use(pluginFactory);

        expect(pluginFactory).to.have.callCount(1);
    });
});
