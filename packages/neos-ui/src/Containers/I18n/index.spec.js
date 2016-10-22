import test from 'ava';
import React from 'react';
import {mount} from 'enzyme';
import I18n from './index.js';

test(`Host > Containers > I18n: should be decoreated with @neos.`, t => {
    const tag = mount(<I18n/>, {
        context: {
            configuration: {},
            translations: {}
        }
    });
    const original = mount(<I18n.Original translations={{}}/>);

    t.is(tag.name(), 'Neos(I18n)');
    t.is(original.name(), 'I18n');
});

test(`Host > Containers > I18n: should render a <span> node.`, t => {
    const original = mount(<I18n.Original translations={{}}/>);

    t.is(original.html(), '<span></span>');
});

test(`
    Host > Containers > I18n: should display configured fallback, if no translation
    was found.`, t => {
    const original = mount(<I18n.Original fallback="The Fallback" translations={{}}/>);

    t.is(original.html(), '<span>The Fallback</span>');
});

test(`
    Host > Containers > I18n: should display the trans unit id, if no translation
    was found and no fallback was configured.`, t => {
    const original = mount(<I18n.Original id="The Trans Unit Id" translations={{}}/>);

    t.is(original.html(), '<span>The Trans Unit Id</span>');
});

test(`
    Host > Containers > I18n: should display the translated string, if a translation
    was found via short-string.`, t => {
    const translations = {
        'Neos_Neos': { // eslint-disable-line quote-props
            'Main': { // eslint-disable-line quote-props
                'someLabel': 'The Translation' // eslint-disable-line quote-props
            }
        }
    };
    const original = mount(<I18n.Original id="Neos.Neos:Main:someLabel" translations={translations}/>);

    t.is(original.html(), '<span>The Translation</span>');
});

test(`
    Host > Containers > I18n: should display the translated string, if a translation
    was found via full-length prop description.`, t => {
    const translations = {
        'Neos_Neos': { // eslint-disable-line quote-props
            'Main': { // eslint-disable-line quote-props
                'someLabel': 'The Translation' // eslint-disable-line quote-props
            }
        }
    };
    const original = mount(
        <I18n.Original
            id="someLabel"
            packageKey="Neos.Neos"
            sourceName="Main"
            translations={translations}
            />
    );

    t.is(original.html(), '<span>The Translation</span>');
});
