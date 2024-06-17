import React from 'react';
import {mount} from 'enzyme';

import I18n from './index';
import {i18nRegistry} from './registry';

beforeEach(() => {
    jest.spyOn(i18nRegistry, 'translate');
    jest.mocked(i18nRegistry.translate).mockImplementation((key) => {
        return key;
    });
});
afterEach(() => {
    jest.restoreAllMocks();
});

test(`<I18n/> should render a <span> node.`, () => {
    const original = mount(<I18n />);

    expect(original.html()).toBe('<span></span>');
});

test(`<I18n/> should call translation service with key.`, () => {
    const original = mount(<I18n id="My key"/>);

    expect(original.html()).toBe('<span>My key</span>');
});
