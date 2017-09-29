import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {StoryWrapper} from './storyUtils.js';

Enzyme.configure({ adapter: new Adapter() });

test('should be a React element.', () => {
    expect(typeof StoryWrapper).toBe('function');
});
test('should render the given "children" prop.', () => {
    const result = shallow(<StoryWrapper>Foo children</StoryWrapper>);

    expect(result.html().includes('Foo children')).toBeTruthy();
});
