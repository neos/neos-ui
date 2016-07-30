import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import CheckBox from './checkBox.js';

const defaultProps = {
    isChecked: false,
    theme: {}
};
const shallow = createShallowRenderer(CheckBox, defaultProps);

test('should render a "input" node with the role="button" attribute.', t => {
    const input = shallow().find('[type="checkbox"]');

    t.truthy(input.length === 1);
});

test('should throw no errors if no "onChange" prop was passed when clicking on the hidden checkbox.', t => {
    const cb = shallow();
    const fn = () => cb.find('[type="checkbox"]').simulate('change');

    t.notThrows(fn);
});

test('should call the passed "onChange" prop when clicking on the hidden checkbox.', t => {
    const onChange = sinon.spy();
    const cb = shallow({onChange});

    cb.find('[type="checkbox"]').simulate('change');

    t.truthy(onChange.callCount === 1);
});

test('should set truthy aria and checked attribute when passing a truthy "isChecked" prop.', t => {
    const markup = shallow({isChecked: true}).find('[type="checkbox"]').html();

    t.truthy(markup.includes('checked="true"'));
    t.truthy(markup.includes('aria-checked="true"'));
});

test('should set falsy aria and checked attribute when passing a falsy "isChecked" prop.', t => {
    const markup = shallow({isChecked: false}).find('[type="checkbox"]').html();

    t.truthy(markup.includes('checked="false"'));
    t.truthy(markup.includes('aria-checked="false"'));
});
