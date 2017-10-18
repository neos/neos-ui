import React from 'react';
import {mount} from 'enzyme';

import I18n from './index.js';

const FakeRegistry = {
    translate(key) {
        return key;
    }
};

test(`Host > Containers > I18n: should render a <span> node.`, () => {
    const original = mount(<I18n.Original i18nRegistry={FakeRegistry}/>);

    expect(original.html()).toBe('<span></span>');
});

test(`
    Host > Containers > I18n: should call translation service with key.`, () => {
    const original = mount(<I18n.Original i18nRegistry={FakeRegistry} id="My key"/>);

    expect(original.html()).toBe('<span>My key</span>');
});

