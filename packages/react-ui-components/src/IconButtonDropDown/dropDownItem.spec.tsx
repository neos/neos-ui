import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import DropDownItem, {DropDownItemProps} from './dropDownItem';

describe('<DropDownItem/>', () => {
    const props: DropDownItemProps = {
        children: <div>Foo children</div>,
        className: 'fooClassName',
        id: 'fooId',
        onClick: jest.fn(),
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<DropDownItem {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<DropDownItem {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should call the "onClick" prop with the passed "id" when clicking on the anchor.', () => {
        const onClick = jest.fn();
        const wrapper = shallow(<DropDownItem {...props} onClick={onClick}/>);

        wrapper.simulate('click');

        expect(onClick.mock.calls.length).toBe(1);
        expect(onClick.mock.calls[0][0]).toBe('fooId');
    });
});
