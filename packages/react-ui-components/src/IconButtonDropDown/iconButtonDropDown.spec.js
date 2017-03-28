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

test('should initialize with a state of "{isOpen: false}".', () => {
    const dd = shallow();

    expect(dd.state('isOpen')).toBe(false);
});
test('should render a "div" node with the themes "wrapper" className.', () => {
    const dd = shallow();

    expect(dd.type()).toBe('div');
    expect(dd.hasClass('baseWrapperClassName')).toBeTruthy();
});
test('should render the "className" prop if passed.', () => {
    const dd = shallow({
        className: 'barClassName'
    });

    expect(dd.hasClass('barClassName')).toBeTruthy();
});
test('should render a "ButtonComponent" component with style="clean" and aria-haspopup="true" prop and a className which matches the themes "wrapper__btn".', () => {
    const dd = shallow();
    const btn = dd.find(Button);

    expect(btn.prop('style')).toBe('clean');
    expect(btn.prop('aria-haspopup')).toBe('true');
    expect(btn.hasClass('baseBtnClassName')).toBeTruthy();
});
test('should render a "ButtonComponent" component which reflects the "isDisabled" prop.', () => {
    const dd = shallow({
        isDisabled: 'fooDisabled'
    });
    const btn = dd.find(Button);

    expect(btn.prop('isDisabled')).toBe('fooDisabled');
});
test('should set the "isOpen" state to "true" when pressing the "ButtonComponent" for more than 200 ms.', () => {
    const dd = shallow();
    const btn = dd.find(Button);

    return new Promise(resolve => {
        btn.simulate('mouseDown');

        setTimeout(() => {
            expect(dd.state('isOpen')).toBe(true);
            resolve();
        }, 300);
    });
});
test('should abort the setting of the "isOpen" state to "true" when pressing and afterwards clicking on the "ButtonComponent" within the 200 ms.', () => {
    const dd = shallow();
    const btn = dd.find(Button);

    return new Promise(resolve => {
        btn.simulate('mouseDown');

        btn.simulate('click');

        setTimeout(() => {
            expect(dd.state('isOpen')).toBe(false);
            resolve();
        }, 300);
    });
});
test('should call the "onClick" prop when clicking on the "ButtonComponent".', () => {
    const props = {
        onClick: sinon.spy()
    };
    const dd = shallow(props);
    const btn = dd.find(Button);

    btn.simulate('click');

    expect(props.onClick.calledOnce).toBeTruthy();
});

test('should render two "IconComponent"s within the "ButtonComponent".', () => {
    const dd = shallow();
    const btn = dd.find(Button);
    const icons = btn.find(Icon);

    expect(icons.length).toBe(2);
});
test('should propagate the "modeIcon" prop to the first "IconComponent".', () => {
    const dd = shallow();
    const btn = dd.find(Button);
    const icon = btn.find(Icon).at(0);

    expect(icon.prop('icon')).toBe('fooModeIcon');
});
test('should propagate the "icon" prop to the second "IconComponent".', () => {
    const dd = shallow();
    const btn = dd.find(Button);
    const icon = btn.find(Icon).at(1);

    expect(icon.prop('icon')).toBe('barGeneralIcon');
});

test('should render a "DropDownItem" for each passed child and propagate the "dropDownId" to it as "id".', () => {
    const dd = shallow();
    const items = dd.find(DropDownItem);

    expect(items.length).toBe(2);
    expect(items.at(0).prop('id')).toBe('foo1');
    expect(items.at(1).prop('id')).toBe('foo2');
});
test('should call the "onItemSelect" prop when clicking on a "DropDownItem".', () => {
    const props = {
        onItemSelect: sinon.spy()
    };
    const dd = shallow(props);
    const item = dd.find(DropDownItem).at(0);

    item.simulate('click');

    expect(props.onItemSelect.calledOnce).toBeTruthy();
});
