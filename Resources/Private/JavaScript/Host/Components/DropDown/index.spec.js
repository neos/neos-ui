import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import DropDown from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"DropDown" component', () => {
    it('should initially have a falsy "isOpened" state value.', () => {
        const dd = shallow(<DropDown />);

        expect(dd.state('isOpened')).to.equal(false);
    });

    it('should set the "isOpened" state value to opposite when calling the toggle method.', () => {
        const dd = shallow(<DropDown />);

        dd.instance().toggle();

        expect(dd.state('isOpened')).to.equal(true);

        dd.instance().toggle();

        expect(dd.state('isOpened')).to.equal(false);
    });

    it('should set the "isOpened" state value to false when calling the close method.', () => {
        const dd = shallow(<DropDown />);

        dd.setState({
            isOpened: true
        });

        dd.instance().close();

        expect(dd.state('isOpened')).to.equal(false);
    });
});
