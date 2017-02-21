import Float from './Float/index';
import Count from './Count/index';
import NotEmpty from './NotEmpty/index';
import NumberRange from './NumberRange/index';
import StringLength from './StringLength/index';
import Text from './Text/index';
import RegularExpression from './RegularExpression/index';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('validators', {}, globalRegistry => {
    const validatorRegistry = globalRegistry.get('validators');

    validatorRegistry.add('Neos.Neos/Validation/FloatValidator', Float);
    validatorRegistry.add('Neos.Neos/Validation/CountValidator', Count);
    validatorRegistry.add('Neos.Neos/Validation/NotEmptyValidator', NotEmpty);
    validatorRegistry.add('Neos.Neos/Validation/NumberRangeValidator', NumberRange);
    validatorRegistry.add('Neos.Neos/Validation/StringLengthValidator', StringLength);
    validatorRegistry.add('Neos.Neos/Validation/TextValidator', Text);
    validatorRegistry.add('Neos.Neos/Validation/RegularExpressionValidator', RegularExpression);
});
