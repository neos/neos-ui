import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import SideBar from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"SideBar" component', () => {
    it('should render a "div" node.', () => {
        const bar = shallow(<SideBar />);

        expect(bar.type()).to.equal('div');
    });

    it('should add the passed "className" prop to the rendered node if passed.', () => {
        const bar = shallow(<SideBar className="test" />);

        expect(bar).to.have.className('test');
    });
});
