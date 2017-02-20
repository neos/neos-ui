import test from 'ava';
import React from 'react';
import {mount} from 'enzyme';

import I18n from './index.js';

const FakeRegistry = {
    translate(key) {
        return key;
    }
};

test(`Host > Containers > I18n: should render a <span> node.`, t => {
    const original = mount(<I18n.Original i18nRegistry={FakeRegistry}/>);

    t.is(original.html(), '<span></span>');
});

test(`
    Host > Containers > I18n: should call translation service with key.`, t => {
    const original = mount(<I18n.Original i18nRegistry={FakeRegistry} id="My key"/>);

    t.is(original.html(), '<span>My key</span>');
});

