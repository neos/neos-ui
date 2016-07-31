import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import {StoryWrapper} from './storyUtils.js';

test('should be a React element.', t => {
    t.is(typeof StoryWrapper, 'function');
});
test('should render the given "title" prop.', t => {
    const result = shallow(<StoryWrapper title="Foo title">Foo children</StoryWrapper>);

    t.truthy(result.html().includes('Foo title'));
});
test('should render the given "children" prop.', t => {
    const result = shallow(<StoryWrapper title="Foo title">Foo children</StoryWrapper>);

    t.truthy(result.html().includes('Foo children'));
});
