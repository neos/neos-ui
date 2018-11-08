import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import ToolTip, {TooltipProps, defaultProps} from './tooltip';

describe('<ToolTip/>', () => {
    const props: TooltipProps = {
        ...defaultProps,
        children: 'Foo children',
        theme: {
            tooltip: 'tooltipClassName',
            'tooltip--asError': 'asErrorClassName',
            'tooltip--inline': 'inlineClassName',
            'tooltip--arrow': 'arrowClassName',
            'tooltip--inner': 'innerClassName',
        },
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<ToolTip {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ToolTip {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });
});
