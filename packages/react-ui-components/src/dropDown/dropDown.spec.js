import test from 'ava';
import {createShallowRenderer} from './../_lib/testUtils.js';
import {DropDown} from './dropDown.js';

const defaultProps = {
    children: 'Foo children',
    theme: {}
};
const shallow = createShallowRenderer(DropDown, defaultProps);

test('<DropDown/> should initially have a falsy "isOpen" state value.', t => {
    const dd = shallow();

    t.falsy(dd.state('isOpen'));
});
test('<DropDown/> should set the "isOpen" state value to opposite when calling the toggle method.', t => {
    const dd = shallow();

    dd.instance().toggle();

    t.truthy(dd.state('isOpen'));

    dd.instance().toggle();

    t.falsy(dd.state('isOpen'));
});
test('<DropDown/> should set the "isOpen" state value to false when calling the close method.', t => {
    const dd = shallow();

    dd.instance().close();

    t.falsy(dd.state('isOpen'));
});
