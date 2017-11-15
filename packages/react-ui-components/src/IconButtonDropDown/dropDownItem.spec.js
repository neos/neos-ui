import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import DropDownItem from './dropDownItem.js';

describe('<DropDownItem/>', () => {
    let props;

    beforeEach(() => {
        props = {
            onClick: () => null,
            id: 'fooId',
            children: <div>Foo children</div>
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<DropDownItem {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<DropDownItem {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<DropDownItem {...props} foo="bar"/>);

        expect(wrapper.prop('foo')).toBe('bar');
    });

    it('should call the "onClick" prop with the passed "id" when clicking on the anchor.', () => {
        const onClick = jest.fn();
        const wrapper = shallow(<DropDownItem {...props} onClick={onClick}/>);

        wrapper.simulate('click');

        expect(onClick.mock.calls.length).toBe(1);
        expect(onClick.mock.calls[0][0]).toBe('fooId');
    });
});
