import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Label, {LabelProps} from './label';

describe('<Label/>', () => {
    const props: LabelProps = {
        htmlFor: 'test for',
        theme: {
            label: 'labelClassName'
        }

    };

    it('should render correctly.', () => {
        const wrapper = shallow(<Label {...props}/>); // eslint-disable-line jsx-a11y/label-has-for

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Label {...props} className="fooClassName"/>); // eslint-disable-line jsx-a11y/label-has-for

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<Label {...props} title="foo"/>); // eslint-disable-line jsx-a11y/label-has-for

        expect(wrapper.prop('title')).toBe('foo');
    });
});
