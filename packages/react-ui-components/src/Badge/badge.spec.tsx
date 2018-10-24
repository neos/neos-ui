import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Badge, {BadgeProps} from './badge';

describe('<Badge/>', () => {
    const props: BadgeProps = {
        label: 'Foo children',
        theme: {
            badge: 'badgeClassName',
        },
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<Badge {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Badge {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });
});
