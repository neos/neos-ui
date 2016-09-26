import test from 'ava';
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

test('should render the "dropDown__btn" prop of the theme.', t => {
    const header = shallow();

    t.truthy(header.hasClass('baseDropDownHeaderClassName'));
});
test('should render the "className" prop if passed.', t => {
    const header = shallow({
        className: 'barClassName'
    });

    t.truthy(header.hasClass('barClassName'));
});
test('should call the "toggleDropDown" prop when clicking on the wrapper.', t => {
    const props = {
        toggleDropDown: sinon.spy()
    };
    const header = shallow(props);

    header.simulate('click');

    t.truthy(props.toggleDropDown.calledOnce);
});
test('should call the "_refHandler" prop with the current "isOpen" prop when rendering the node.', t => {
    const props = {
        _refHandler: sinon.spy(),
        isOpen: 'foo'
    };
    shallow(props);

    t.truthy(props._refHandler.calledOnce);
    t.is(props._refHandler.args[0][0], 'foo');
});
test('should render a node with a aria-haspopup attribute.', t => {
    const props = {
        _refHandler: sinon.spy(),
        isOpen: 'foo'
    };
    const header = shallow(props);

    t.truthy(header.html().includes('aria-haspopup'));
});
test('should propagate the rest of the passed props to the wrapping node.', t => {
    const header = shallow({
        id: 'fooId'
    });

    t.truthy(header.html().includes('id="fooId"'));
});
test('should render the passed "IconComponent" with the themes "dropDown__chevron" className and a "chevron-down" icon prop.', t => {
    const header = shallow();
    const icon = header.find(Icon);

    t.truthy(icon.hasClass('baseDropDownHeaderChevronClassName'));
    t.is(icon.prop('icon'), 'chevron-down');
});
test('should render the passed "IconComponent" with a "chevron-up" icon prop in case the "isOpen" prop is truthy.', t => {
    const header = shallow({isOpen: true});
    const icon = header.find(Icon);

    t.truthy(icon.hasClass('baseDropDownHeaderChevronClassName'));
    t.is(icon.prop('icon'), 'chevron-up');
});
