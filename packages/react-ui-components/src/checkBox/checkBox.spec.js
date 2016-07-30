import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';

import CheckBox from './checkBox.js';

test('<CheckBox/> should render a "input" node with the role="button" attribute.', t => {
    const input = shallow(<CheckBox />).find('[type="checkbox"]');

    t.truthy(input.length === 1);
});

test('<CheckBox/> should throw no errors if no "onChange" prop was passed when clicking on the hidden checkbox.', t => {
    const cb = shallow(<CheckBox />);
    const fn = () => cb.find('[type="checkbox"]').simulate('change');

    t.notThrows(fn);
});

test('<CheckBox/> should call the passed "onChange" prop when clicking on the hidden checkbox.', t => {
    const spy = sinon.spy();
    const cb = shallow(<CheckBox onChange={spy} />);

    cb.find('[type="checkbox"]').simulate('change');

    t.truthy(spy.callCount === 1);
});

test('<CheckBox/> should set truthy aria and checked attribute when passing a truthy "isChecked" prop.', t => {
    const markup = shallow(<CheckBox isChecked={true} />).find('[type="checkbox"]').html();

    t.truthy(markup.includes('checked="true"'));
    t.truthy(markup.includes('aria-checked="true"'));
});

test('<CheckBox/> should set falsy aria and checked attribute when passing a falsy "isChecked" prop.', t => {
    const markup = shallow(<CheckBox isChecked={false} />).find('[type="checkbox"]').html();

    t.truthy(markup.includes('checked="false"'));
    t.truthy(markup.includes('aria-checked="false"'));
});
