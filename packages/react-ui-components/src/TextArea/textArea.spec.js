import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import TextareaAutoresize from 'react-textarea-autosize';
import {createStubComponent} from './../_lib/testUtils.js';
import {undecorated as TextArea} from './textArea.js';

describe('<TextArea/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {},
            TooltipComponent: createStubComponent()
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<TextArea {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<TextArea {...props} className="fooClassName"/>);
        const input = wrapper.find(TextareaAutoresize);

        expect(input.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<TextArea {...props} foo="bar"/>);
        const input = wrapper.find(TextareaAutoresize);

        expect(input.prop('foo')).toBe('bar');
    });

    it('should call the passed "onChange" prop with the value of the input when changing it.', () => {
        const onChange = jest.fn();
        const wrapper = shallow(<TextArea {...props} onChange={onChange}/>);
        const input = wrapper.find(TextareaAutoresize);

        input.simulate('change', {
            target: {
                value: 'my value'
            }
        });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('my value');
    });
});
