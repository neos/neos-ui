import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Bar, {BarProps} from './bar';

describe('<Bar/>', () => {
    const props: BarProps = {
        children: 'Foo children',
        position: 'top',
        theme: {
            'bar': 'barClassName',
            'bar--bottom': 'bottomClassName',
            'bar--top': 'topClassName',
        }
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<Bar {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Bar {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });
});
