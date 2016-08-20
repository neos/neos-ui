import React from 'react';
import chai, {expect} from 'chai';
import sinon from 'sinon/pkg/sinon.js';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import CheckBox from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"host.components.checkBox"', () => {
    it('should render checkbox input as one of its children.', () => {
        const cb = shallow(<CheckBox/>);

        expect(cb.find('[type="checkbox"]')).be.present();
    });

    it('should render checkbox input as one of its children.', () => {
        const cb = shallow(<CheckBox/>);

        expect(cb.find('[type="checkbox"]')).be.present();
    });

    it('should throw no error if no "onChange" prop was passed when clicking on the hidden checkbox.', () => {
        const cb = shallow(<CheckBox/>);
        const fn = () => cb.find('[type="checkbox"]').simulate('change');

        expect(fn).to.not.throw();
    });

    it('should call the passed "onChange" prop when clicking on the hidden checkbox.', () => {
        const spy = sinon.spy();
        const cb = shallow(<CheckBox onChange={spy}/>);

        cb.find('[type="checkbox"]').simulate('change');

        expect(spy).to.have.callCount(1);
    });

    it('should set the aria and checked attribute when passing the "isChecked" prop.', () => {
        const checkedBox = shallow(<CheckBox isChecked={true}/>).find('[type="checkbox"]');

        expect(checkedBox).to.have.attr('checked');
        expect(checkedBox).to.have.attr('aria-checked', 'true');

        const unCheckedBox = shallow(<CheckBox isChecked={false}/>).find('[type="checkbox"]');

        expect(unCheckedBox).to.not.have.attr('checked');
        expect(unCheckedBox).to.have.attr('aria-checked', 'false');
    });
});
