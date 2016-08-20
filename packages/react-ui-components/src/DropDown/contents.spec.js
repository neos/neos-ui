import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import ShallowDropDownContents from './contents.js';

const defaultProps = {
    children: 'Foo children',
    isOpen: false,
    closeDropDown: () => null,
    theme: {
        'dropDown__contents': 'baseDropDownContentsClassName',
        'dropDown__contents--isOpen': 'openDropDownContentsClassName'
    }
};
const shallow = createShallowRenderer(ShallowDropDownContents, defaultProps);

test('should render the themes "dropDown__contents" className.', t => {
    const contents = shallow();

    t.truthy(contents.hasClass('baseDropDownContentsClassName'));
});
test('should render the themes "dropDown__contents--isOpen" className in case the "isOpen" prop is truthy.', t => {
    const contents = shallow({
        isOpen: true
    });

    t.truthy(contents.hasClass('openDropDownContentsClassName'));
});
test('should render the "className" prop if passed.', t => {
    const contents = shallow({
        className: 'barClassName'
    });

    t.truthy(contents.hasClass('barClassName'));
});
test('should render a aria-hidden="true" attribute in the wrapper by default.', t => {
    const contents = shallow();

    t.truthy(contents.html().includes('aria-hidden="true"'));
});
test('should render a aria-hidden="false" attribute in the wrapper in case the "isOpen" prop is truthy.', t => {
    const contents = shallow({
        isOpen: true
    });

    t.truthy(contents.html().includes('aria-hidden="false"'));
});
test('should render a aria-label="dropdown" and role="button" attribute in the wrapper.', t => {
    const contents = shallow({
        isOpen: true
    });

    t.truthy(contents.html().includes('aria-label="dropdown"'));
    t.truthy(contents.html().includes('role="button"'));
});
test('should call the "closeDropDown" prop when clicking on the wrapper.', t => {
    const props = {
        closeDropDown: sinon.spy()
    };
    const contents = shallow(props);

    contents.simulate('click');

    t.truthy(props.closeDropDown.calledOnce);
});
test('should render the passed children.', t => {
    const contents = shallow();

    t.truthy(contents.html().includes('Foo children'));
});
test('should propagate the rest of the passed props to the wrapping node.', t => {
    const contents = shallow({
        id: 'fooId'
    });

    t.truthy(contents.html().includes('id="fooId"'));
});
