import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import IconButtonDropDown from './iconButtonDropDown.js';
import DropDownItem from './dropDownItem.js';

const Icon = createStubComponent();
const Button = createStubComponent();
const defaultProps = {
    icon: 'barGeneralIcon',
    children: [
        createStubComponent()({dropDownId: 'foo1'}),
        createStubComponent()({dropDownId: 'foo2'})
    ],
    modeIcon: 'fooModeIcon',
    onClick: () => null,
    onItemSelect: () => null,
    theme: {
        'wrapper': 'baseWrapperClassName',
        'wrapper__btn': 'baseBtnClassName',
        'wrapper__btnModeIcon': 'baseBtnIconClassName',
        'wrapper__dropDown': 'baseDropDownClassName',
        'wrapper__dropDown--isOpen': 'baseDropDownOpenClassName',
        'wrapper__dropDownItem': 'baseDropDownItemClassName'
    },
    IconComponent: Icon,
    ButtonComponent: Button
};
const shallow = createShallowRenderer(IconButtonDropDown, defaultProps);

test('should initialize with a state of "{isOpen: false}".', t => {
    const dd = shallow();

    t.is(dd.state('isOpen'), false);
});
test('should render a "div" node with the themes "wrapper" className.', t => {
    const dd = shallow();

    t.is(dd.type(), 'div');
    t.truthy(dd.hasClass('baseWrapperClassName'));
});
test('should render the "className" prop if passed.', t => {
    const dd = shallow({
        className: 'barClassName'
    });

    t.truthy(dd.hasClass('barClassName'));
});
test('should render a "ButtonComponent" component with style="clean" and aria-haspopup="true" prop and a className which matches the themes "wrapper__btn".', t => {
    const dd = shallow();
    const btn = dd.find(Button);

    t.is(btn.prop('style'), 'clean');
    t.is(btn.prop('aria-haspopup'), 'true');
    t.truthy(btn.hasClass('baseBtnClassName'));
});
test('should render a "ButtonComponent" component which reflects the "isDisabled" prop.', t => {
    const dd = shallow({
        isDisabled: 'fooDisabled'
    });
    const btn = dd.find(Button);

    t.is(btn.prop('isDisabled'), 'fooDisabled');
});
test('should set the "isOpen" state to "true" when pressing the "ButtonComponent" for more than 200 ms.', t => {
    const dd = shallow();
    const btn = dd.find(Button);

    return new Promise(resolve => {
        btn.simulate('mouseDown');

        setTimeout(() => {
            t.is(dd.state('isOpen'), true);
            resolve();
        }, 300);
    });
});
test('should abort the setting of the "isOpen" state to "true" when pressing and afterwards clicking on the "ButtonComponent" within the 200 ms.', t => {
    const dd = shallow();
    const btn = dd.find(Button);

    return new Promise(resolve => {
        btn.simulate('mouseDown');

        btn.simulate('click');

        setTimeout(() => {
            t.is(dd.state('isOpen'), false);
            resolve();
        }, 300);
    });
});
test('should call the "onClick" prop when clicking on the "ButtonComponent".', t => {
    const props = {
        onClick: sinon.spy()
    };
    const dd = shallow(props);
    const btn = dd.find(Button);

    btn.simulate('click');

    t.truthy(props.onClick.calledOnce);
});

test('should render two "IconComponent"s within the "ButtonComponent".', t => {
    const dd = shallow();
    const btn = dd.find(Button);
    const icons = btn.find(Icon);

    t.is(icons.length, 2);
});
test('should propagate the "modeIcon" prop to the first "IconComponent".', t => {
    const dd = shallow();
    const btn = dd.find(Button);
    const icon = btn.find(Icon).at(0);

    t.is(icon.prop('icon'), 'fooModeIcon');
});
test('should propagate the "icon" prop to the second "IconComponent".', t => {
    const dd = shallow();
    const btn = dd.find(Button);
    const icon = btn.find(Icon).at(1);

    t.is(icon.prop('icon'), 'barGeneralIcon');
});

test('should render a "DropDownItem" for each passed child and propagate the "dropDownId" to it as "id".', t => {
    const dd = shallow();
    const items = dd.find(DropDownItem);

    t.is(items.length, 2);
    t.is(items.at(0).prop('id'), 'foo1');
    t.is(items.at(1).prop('id'), 'foo2');
});
test('should call the "onItemSelect" prop when clicking on a "DropDownItem".', t => {
    const props = {
        onItemSelect: sinon.spy()
    };
    const dd = shallow(props);
    const item = dd.find(DropDownItem).at(0);

    item.simulate('click');

    t.truthy(props.onItemSelect.calledOnce);
});
