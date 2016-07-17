import React from 'react';
import chai, {expect} from 'chai';
import sinon from 'sinon/pkg/sinon.js';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import TextArea from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"host.components.textArea"', () => {
    it('should add the passed "className" prop to the rendered button if passed.', () => {
        const input = shallow(<TextArea className="test" />);

        expect(input).to.have.className('test');
    });

    it('should call the passed "onFocus" prop when focusing the button.', () => {
        const spy = sinon.spy();
        const input = shallow(<TextArea onFocus={spy} />);

        input.simulate('focus');

        expect(spy).to.have.callCount(1);
    });

    it('should call the passed "onChange" prop with the value of the input when changing it.', () => {
        const spy = sinon.spy();
        const input = shallow(<TextArea onChange={spy} />);

        input.simulate('change', {
            target: {
                value: 'my value'
            }
        });

        expect(spy).to.have.callCount(1);
        expect(spy).to.have.been.calledWith('my value');
    });

    it('should throw no error if no "onChange" prop was passed when changing the value of the input.', () => {
        const input = shallow(<TextArea />);
        const fn = () => {
            input.simulate('change', {
                target: {
                    value: 'my value'
                }
            });
        };

        expect(fn).to.not.throw();
    });

    it('should call the passed "onBlur" prop when leaving the focused state of the input.', () => {
        const spy = sinon.spy();
        const input = shallow(<TextArea onBlur={spy} />);

        input.simulate('blur');

        expect(spy).to.have.callCount(1);
    });
});
