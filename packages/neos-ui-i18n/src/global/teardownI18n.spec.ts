/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {globals, unsetGlobals} from './globals';
import {setupI18n} from './setupI18n';
import {teardownI18n} from './teardownI18n';

describe('teardownI18n', () => {
    afterEach(() => {
        unsetGlobals();
    });

    it('unsets the previously registered locale and translation repository', () => {
        setupI18n('en-US', 'one,other', {
            'Neos_Neos_Ui': {
                'Main': {
                    'trans-unit_id': 'Some Translation'
                }
            }
        });

        expect(globals.current).not.toBeNull();

        teardownI18n();

        expect(globals.current).toBeNull();
    });
});
