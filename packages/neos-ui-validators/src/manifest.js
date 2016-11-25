import NotEmpty from './NotEmpty/index';
import StringLength from './StringLength/index';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('validators', {}, globalRegistry => {
    const validatorRegistry = globalRegistry.get('validators');

    validatorRegistry.add('TYPO3.Neos/Validation/NotEmptyValidator', NotEmpty);
    validatorRegistry.add('TYPO3.Neos/Validation/StringLengthValidator', StringLength);
});
