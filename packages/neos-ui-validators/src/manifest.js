import Alphanumeric from './Alphanumeric/index';
import NotEmpty from './NotEmpty/index';
import NumberRange from './NumberRange/index';
import RegularExpression from './RegularExpression/index';
import StringLength from './StringLength/index';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('validators', {}, globalRegistry => {
    const validatorRegistry = globalRegistry.get('validators');

    validatorRegistry.add('Neos.Neos/Validation/AlphanumericValidator', Alphanumeric);
    validatorRegistry.add('Neos.Neos/Validation/NotEmptyValidator', NotEmpty);
    validatorRegistry.add('Neos.Neos/Validation/NumberRangeValidator', NumberRange);
    validatorRegistry.add('Neos.Neos/Validation/RegularExpressionValidator', RegularExpression);
    validatorRegistry.add('Neos.Neos/Validation/StringLengthValidator', StringLength);
});
