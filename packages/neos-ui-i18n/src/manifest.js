import manifest from '@neos-project/neos-ui-extensibility';

import {I18nRegistry} from './registry/index';

manifest('@neos-project/neos-ui-i18n', {}, globalRegistry => {
    globalRegistry.set(
        'i18n',
        new I18nRegistry(`
            # Registry for Internationalization / Localization

            Has one public method "translate()" which can be used to translate strings.
        `)
    );
});
