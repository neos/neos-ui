/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';
import {mount} from 'enzyme';

import {i18nRegistry} from '../registry';

import {I18n} from './I18n';

describe('<I18n/>', () => {
    beforeEach(() => {
        jest.spyOn(i18nRegistry, 'translate');
        (jest as any)
            .mocked(i18nRegistry.translate)
            .mockImplementation((key: string) => {
                return key;
            });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it(`should render a <span> node.`, () => {
        const original = mount(<I18n />);

        expect(original.html()).toBe('<span></span>');
    });

    it(`should call translation service with key.`, () => {
        const original = mount(<I18n id="My key" />);

        expect(original.html()).toBe('<span>My key</span>');
    });
});
