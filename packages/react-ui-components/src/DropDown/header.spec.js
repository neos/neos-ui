import sinon from 'sinon';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import ShallowDropDownHeader from './header.js';

const Icon = createStubComponent();
const defaultProps = {
    children: 'Foo children',
    IconComponent: Icon,
    isOpen: false,
    toggleDropDown: () => null,
    theme: {/* eslint-disable quote-props */
        'dropDown__btn': 'baseDropDownHeaderClassName',
        'dropDown__chevron': 'baseDropDownHeaderChevronClassName'
    }/* eslint-enable quote-props */
};
const shallow = createShallowRenderer(ShallowDropDownHeader, defaultProps);

test('should render the "dropDown__btn" prop of the theme.', () => {
    const header = shallow();

    expect(header.hasClass('baseDropDownHeaderClassName')).toBeTruthy();
});
test('should render the "className" prop if passed.', () => {
    const header = shallow({
        className: 'barClassName'
    });

    expect(header.hasClass('barClassName')).toBeTruthy();
});
test('should call the "toggleDropDown" prop when clicking on the wrapper.', () => {
    const props = {
        toggleDropDown: sinon.spy()
    };
    const header = shallow(props);

    header.simulate('click');

    expect(props.toggleDropDown.calledOnce).toBeTruthy();
});
test('should call the "_refHandler" prop with the current "isOpen" prop when rendering the node.', () => {
    const props = {
        _refHandler: sinon.spy(),
        isOpen: 'foo'
    };
    shallow(props);

    expect(props._refHandler.calledOnce).toBeTruthy();
    expect(props._refHandler.args[0][0]).toBe('foo');
});
test('should render a node with a aria-haspopup attribute.', () => {
    const props = {
        _refHandler: sinon.spy(),
        isOpen: 'foo'
    };
    const header = shallow(props);

    expect(header.html().includes('aria-haspopup')).toBeTruthy();
});
test('should propagate the rest of the passed props to the wrapping node.', () => {
    const header = shallow({
        id: 'fooId'
    });

    expect(header.html().includes('id="fooId"')).toBeTruthy();
});
test('should render the passed "IconComponent" with the themes "dropDown__chevron" className and a "chevron-down" icon prop.', () => {
    const header = shallow();
    const icon = header.find(Icon);

    expect(icon.hasClass('baseDropDownHeaderChevronClassName')).toBeTruthy();
    expect(icon.prop('icon')).toBe('chevron-down');
});
test('should render the passed "IconComponent" with a "chevron-up" icon prop in case the "isOpen" prop is truthy.', () => {
    const header = shallow({isOpen: true});
    const icon = header.find(Icon);

    expect(icon.hasClass('baseDropDownHeaderChevronClassName')).toBeTruthy();
    expect(icon.prop('icon')).toBe('chevron-up');
});
