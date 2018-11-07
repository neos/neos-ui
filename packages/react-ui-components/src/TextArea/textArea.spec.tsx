import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import TextareaAutosize from 'react-textarea-autosize';

import TextArea, {TextAreaProps, defaultProps} from './textArea';

describe('<TextArea/>', () => {

    const props: TextAreaProps = {
        ...defaultProps
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<TextArea {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<TextArea {...props} className="fooClassName"/>);
        const input = wrapper.find(TextareaAutosize);
        expect(input.prop('className')).toContain('fooClassName');
    });

    it('should call the passed "onChange" prop with the value of the input when changing it.', () => {
        const onChange = jest.fn();
        const wrapper = shallow(<TextArea {...props} onChange={onChange}/>);
        const input = wrapper.find(TextareaAutosize);

        input.simulate('change', {
            target: {
                value: 'my value'
            }
        });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('my value');
    });
});
