import React from 'react';
import {shallow} from 'enzyme';
import {StoryWrapper} from './storyUtils.js';

test('should be a React element.', () => {
    expect(typeof StoryWrapper).toBe('function');
});
test('should render the given "children" prop.', () => {
    const result = shallow(<StoryWrapper>Foo children</StoryWrapper>);

    expect(result.html().includes('Foo children')).toBeTruthy();
});
