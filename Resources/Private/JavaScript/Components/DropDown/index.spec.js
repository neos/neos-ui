import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import {DropDown} from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"host.components.dropDown"', () => {
    it('should initially have a falsy "isOpen" state value.', () => {
        const dd = shallow(<DropDown/>);

        expect(dd.state('isOpen')).to.equal(false);
    });

    it('should set the "isOpen" state value to opposite when calling the toggle method.', () => {
        const dd = shallow(<DropDown/>);

        dd.instance().toggle();

        expect(dd.state('isOpen')).to.equal(true);

        dd.instance().toggle();

        expect(dd.state('isOpen')).to.equal(false);
    });

    it('should set the "isOpen" state value to false when calling the close method.', () => {
        const dd = shallow(<DropDown/>);

        dd.setState({
            isOpen: true
        });

        dd.instance().close();

        expect(dd.state('isOpen')).to.equal(false);
    });
});
