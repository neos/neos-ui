import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Headline, {defaultProps, HeadlineProps} from './headline';

describe('<Headline/>', () => {
    const props: HeadlineProps = {
        ...defaultProps,
        children: 'Foo children',
        theme: {
            'heading': 'headingClassName',
            'heading--h1': 'h1ClassName',
        }
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<Headline {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<Headline {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should render a "h1" node if no "type" prop was passed.', () => {
        const wrapper = shallow(<Headline {...props}/>);

        expect(wrapper.type()).toBe('h1');
    });

    it('should render a the appropriate node if a "type" prop was passed.', () => {
        expect(shallow(<Headline {...props} type="h2"/>).type()).toBe('h2');
        expect(shallow(<Headline {...props} type="h3"/>).type()).toBe('h3');
        expect(shallow(<Headline {...props} type="h4"/>).type()).toBe('h4');
        expect(shallow(<Headline {...props} type="h5"/>).type()).toBe('h5');
        expect(shallow(<Headline {...props} type="h6"/>).type()).toBe('h6');
    });
});
