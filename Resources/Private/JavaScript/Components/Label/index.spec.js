import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import Label from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"host.components.label"', () => {
    it('should render a "label" node.', () => {
        const label = shallow(<Label htmlFor="test"/>);

        expect(label.type()).to.equal('label');
    });

    it('should add the passed "className" prop to the rendered node if passed.', () => {
        const label = shallow(<Label htmlFor="test" className="test"/>);

        expect(label).to.have.className('test');
    });
});
