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

test('should render the themes "dropDown__contents" className.', () => {
    const contents = shallow();

    expect(contents.hasClass('baseDropDownContentsClassName')).toBeTruthy();
});
test('should render the themes "dropDown__contents--isOpen" className in case the "isOpen" prop is truthy.', () => {
    const contents = shallow({
        isOpen: true
    });

    expect(contents.hasClass('openDropDownContentsClassName')).toBeTruthy();
});
test('should render the "className" prop if passed.', () => {
    const contents = shallow({
        className: 'barClassName'
    });

    expect(contents.hasClass('barClassName')).toBeTruthy();
});
test('should render a aria-hidden="true" attribute in the wrapper by default.', () => {
    const contents = shallow();

    expect(contents.html().includes('aria-hidden="true"')).toBeTruthy();
});
test('should render a aria-hidden="false" attribute in the wrapper in case the "isOpen" prop is truthy.', () => {
    const contents = shallow({
        isOpen: true
    });

    expect(contents.html().includes('aria-hidden="false"')).toBeTruthy();
});
test('should render a aria-label="dropdown" and role="button" attribute in the wrapper.', () => {
    const contents = shallow({
        isOpen: true
    });

    expect(contents.html().includes('aria-label="dropdown"')).toBeTruthy();
    expect(contents.html().includes('role="button"')).toBeTruthy();
});
test('should call the "closeDropDown" prop when clicking on the wrapper.', () => {
    const props = {
        closeDropDown: sinon.spy()
    };
    const contents = shallow(props);

    contents.simulate('click');

    expect(props.closeDropDown.calledOnce).toBeTruthy();
});
test('should render the passed children.', () => {
    const contents = shallow();

    expect(contents.html().includes('Foo children')).toBeTruthy();
});
test('should propagate the rest of the passed props to the wrapping node.', () => {
    const contents = shallow({
        id: 'fooId'
    });

    expect(contents.html().includes('id="fooId"')).toBeTruthy();
});
