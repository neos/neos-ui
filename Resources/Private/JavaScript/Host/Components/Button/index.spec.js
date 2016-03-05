import React from 'react';
import chai, {expect} from 'chai';
import sinon from 'sinon/pkg/sinon.js';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import Button from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"Button" component', () => {
    it('should render a "button" node with the role="button" attribute.', () => {
        const btn = shallow(<Button />);

        expect(btn.type()).to.equal('button');
    });

    it('should add the passed "className" prop to the rendered button if passed.', () => {
        const btn = shallow(<Button className="test" />);

        expect(btn).to.have.className('test');
    });

    it('should call the passed "onClick" prop when clicking the button.', () => {
        const spy = sinon.spy();
        const btn = shallow(<Button onClick={spy} />);

        btn.simulate('click');

        expect(spy).to.have.callCount(1);
    });

    it('should call the passed "onMouseDown" prop when clicking the button.', () => {
        const spy = sinon.spy();
        const btn = shallow(<Button onMouseDown={spy} />);

        btn.simulate('mouseDown');

        expect(spy).to.have.callCount(1);
    });

    it('should call the passed "onMouseUp" prop when clicking the button.', () => {
        const spy = sinon.spy();
        const btn = shallow(<Button onMouseUp={spy} />);

        btn.simulate('mouseUp');

        expect(spy).to.have.callCount(1);
    });

    it('should call the passed "onMouseEnter" prop when clicking the button.', () => {
        const spy = sinon.spy();
        const btn = shallow(<Button onMouseEnter={spy} />);

        btn.simulate('mouseEnter');

        expect(spy).to.have.callCount(1);
    });

    it('should call the passed "onMouseLeave" prop when clicking the button.', () => {
        const spy = sinon.spy();
        const btn = shallow(<Button onMouseLeave={spy} />);

        btn.simulate('mouseLeave');

        expect(spy).to.have.callCount(1);
    });

    it('should add the disabled attribute when passing a truthy "isDisabled" prop.', () => {
        const btn = shallow(<Button isDisabled={true} />);

        expect(btn).to.have.attr('disabled');
    });
});
