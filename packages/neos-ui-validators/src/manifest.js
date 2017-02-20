import NotEmpty from './NotEmpty/index';
import NumberRange from './NumberRange/index';
import StringLength from './StringLength/index';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('validators', {}, globalRegistry => {
    const validatorRegistry = globalRegistry.get('validators');

    validatorRegistry.add('Neos.Neos/Validation/NotEmptyValidator', NotEmpty);
    validatorRegistry.add('Neos.Neos/Validation/NumberRangeValidator', NumberRange);
    validatorRegistry.add('Neos.Neos/Validation/StringLengthValidator', StringLength);
});
