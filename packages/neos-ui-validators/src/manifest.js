import NotEmpty from './NotEmpty/index';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('validators', {}, globalRegistry => {
    const validatorRegistry = globalRegistry.get('validators');

    validatorRegistry.add('TYPO3.Neos/Validation/NotEmptyValidator', NotEmpty);
});
