import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Button from '../Button';
import Icon from '../Icon';
import DropDownItem from './dropDownItem';
import IconButtonDropDown, {defaultProps, IconButtonDropDownProps} from './iconButtonDropDown';

describe('<IconButtonDropDown/>', () => {
    const props: IconButtonDropDownProps = {
        ...defaultProps,
        children: [
            // @ts-ignore
            // tslint:disable-next-line:jsx-key
            <div dropDownId="foo1"/>,
            // @ts-ignore
            // tslint:disable-next-line:jsx-key
            <div dropDownId="foo2"/>
        ],
        icon: 'barGeneralIcon',
        modeIcon: 'fooModeIcon',
        onClick: jest.fn(),
        onItemSelect: jest.fn(),
        theme: {
            'wrapper': 'baseWrapperClassName',
            'wrapper__btn': 'baseBtnClassName',
            'wrapper__btnIcon': 'baseBtnIconClassName',
            'wrapper__btnModeIcon': 'baseBtnModeIconClassName',
            'wrapper__dropDown': 'baseDropDownClassName',
            'wrapper__dropDown--isOpen': 'baseDropDownOpenClassName',
            'wrapper__dropDownItem': 'baseIconButtonDropDownClassName'
        },
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<IconButtonDropDown {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<IconButtonDropDown {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should initialize with a state of "{isOpen: false}".', () => {
        const wrapper = shallow(<IconButtonDropDown {...props}/>);

        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('should render a "ButtonComponent" component with style="clean" and aria-haspopup="true" prop and a className which matches the themes "wrapper__btn".', () => {
        const wrapper = shallow(<IconButtonDropDown {...props}/>);
        const btn = wrapper.find(Button);

        expect(btn.prop('style')).toBe('clean');
        expect(btn.prop('aria-haspopup')).toBe('true');
        expect(btn.hasClass('baseBtnClassName')).toBeTruthy();
    });

    it('should render a "ButtonComponent" component which reflects the "disabled" prop.', () => {
        const wrapper = shallow(<IconButtonDropDown {...props} disabled={false}/>);
        const btn = wrapper.find(Button);

        expect(btn.prop('disabled')).toBe(false);
    });

    it('should set the "isOpen" state to "true" when pressing the "ButtonComponent" for more than 200 ms.', () => {
        const wrapper = shallow(<IconButtonDropDown {...props}/>);
        const btn = wrapper.find(Button);

        return new Promise(resolve => {
            btn.simulate('mouseDown');

            setTimeout(() => {
                expect(wrapper.state('isOpen')).toBe(true);
                resolve();
            }, 300);
        });
    });

    it('should abort the setting of the "isOpen" state to "true" when pressing and afterwards clicking on the "ButtonComponent" within the 200 ms.', () => {
        const wrapper = shallow(<IconButtonDropDown {...props}/>);
        const btn = wrapper.find(Button);

        return new Promise(resolve => {
            btn.simulate('mouseDown');

            btn.simulate('click');

            setTimeout(() => {
                expect(wrapper.state('isOpen')).toBe(false);
                resolve();
            }, 300);
        });
    });

    it('should call the "onClick" prop when clicking on the "ButtonComponent".', () => {
        const onClick = jest.fn();
        const wrapper = shallow(<IconButtonDropDown {...props} onClick={onClick}/>);
        const btn = wrapper.find(Button);

        btn.simulate('click');

        expect(onClick.mock.calls.length).toBe(1);
    });

    it('should render two "IconComponent"s within the "ButtonComponent".', () => {
        const wrapper = shallow(<IconButtonDropDown {...props}/>);
        const btn = wrapper.find(Button);
        const icons = btn.find(Icon);

        expect(icons.length).toBe(2);
    });
    it('should propagate the "modeIcon" prop to the first "IconComponent".', () => {
        const wrapper = shallow(<IconButtonDropDown {...props}/>);
        const btn = wrapper.find(Button);
        const icon = btn.find(Icon).at(0);

        expect(icon.prop('icon')).toBe('fooModeIcon');
    });
    it('should propagate the "icon" prop to the second "IconComponent".', () => {
        const wrapper = shallow(<IconButtonDropDown {...props}/>);
        const btn = wrapper.find(Button);
        const icon = btn.find(Icon).at(1);

        expect(icon.prop('icon')).toBe('barGeneralIcon');
    });

    it('should render a "DropDownItem" for each passed child and propagate the "dropDownId" to it as "id".', () => {
        const wrapper = shallow(<IconButtonDropDown {...props}/>);
        const items = wrapper.find(DropDownItem);

        expect(items.length).toBe(2);
        expect(items.at(0).prop('id')).toBe('foo1');
        expect(items.at(1).prop('id')).toBe('foo2');
    });
    it('should call the "onItemSelect" prop when clicking on a "DropDownItem".', () => {
        const onItemSelect = jest.fn();
        const wrapper = shallow(<IconButtonDropDown {...props} onItemSelect={onItemSelect}/>);
        const item = wrapper.find(DropDownItem).at(0);

        item.simulate('click');

        expect(onItemSelect.mock.calls.length).toBe(1);
    });
});
