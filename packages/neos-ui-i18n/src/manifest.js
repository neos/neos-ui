import manifest from '@neos-project/neos-ui-extensibility';

import {i18nRegistry} from './registry';

manifest('@neos-project/neos-ui-i18n', {}, globalRegistry => {
    globalRegistry.set('i18n', i18nRegistry);
});
