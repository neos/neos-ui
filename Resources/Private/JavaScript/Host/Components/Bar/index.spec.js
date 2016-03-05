import React from 'react';
import chai, {expect} from 'chai';
import sinon from 'sinon/pkg/sinon.js';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import Bar from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"Bar" component', () => {
    it('should add the passed "className" prop to the rendered button if passed.', () => {
        const bar = shallow(<Bar className="test" />);

        expect(bar).to.have.className('test');
    });

    it('should call the passed "onDrop" prop when clicking the button.', () => {
        const spy = sinon.spy();
        const btn = shallow(<Bar onDrop={spy} />);

        btn.simulate('drop');

        expect(spy).to.have.callCount(1);
    });
});
