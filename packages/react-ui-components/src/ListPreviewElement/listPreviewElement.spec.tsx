import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import ListPreviewElement from '.';
import {ListPreviewElementProps} from './listPreviewElement';

describe('<Label/>', () => {
    const props: ListPreviewElementProps = {
        children: 'Foo Children',
        onClick: jest.fn(),
        theme: {
            listPreviewElement: 'listPreviewElementClassName',
            'listPreviewElement--isDisabled': 'disabledClassName',
            'listPreviewElement--isHighlighted': 'highlightedClassName',
            listPreviewElement__icon: 'iconClassName',
        }
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<ListPreviewElement {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should allow the propagation of "className" with the "className" prop.', () => {
        const wrapper = shallow(<ListPreviewElement {...props} className="fooClassName"/>);

        expect(wrapper.prop('className')).toContain('fooClassName');
    });

    it('should allow the propagation of additional props to the wrapper.', () => {
        const wrapper = shallow(<ListPreviewElement {...props} data-foo="bar"/>);

        expect(wrapper.prop('data-foo')).toBe('bar');
    });
});
