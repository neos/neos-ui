import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Frame, {FrameProps} from './frame';

describe('<Frame/>', () => {
    const props: FrameProps = {
        children: 'Foo children',
        contentDidUpdate: jest.fn(),
        mountTarget: 'foo',
        onLoad: jest.fn(),
        onUnload: jest.fn(),
        src: 'localhost',
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<Frame {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Frame {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<Frame {...props} frameBorder="0"/>);

        expect(wrapper.prop('frameBorder')).toBe('0');
    });
});
