import React from 'react';
import {shallow} from 'enzyme';
import {StoryWrapper} from './storyUtils';

describe('<StoryWrapper/>', () => {
    it('should be a React element.', () => {
        expect(typeof StoryWrapper).toBe('function');
    });
    it('should render the given "children" prop.', () => {
        const result = shallow(<StoryWrapper>Foo children</StoryWrapper>);

        expect(result.html().includes('Foo children')).toBeTruthy();
    });
});
