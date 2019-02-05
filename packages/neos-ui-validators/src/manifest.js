import Alphanumeric from './Alphanumeric/index';
import Count from './Count/index';
import DateTime from './DateTime/index';
import EmailAddress from './EmailAddress/index';
import Float from './Float/index';
import Integer from './Integer/index';
import Label from './Label/index';
import NotEmpty from './NotEmpty/index';
import NumberRange from './NumberRange/index';
import RegularExpression from './RegularExpression/index';
import String from './String/index';
import StringLength from './StringLength/index';
import Text from './Text/index';
import Uuid from './Uuid/index';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('validators', {}, globalRegistry => {
    const validatorRegistry = globalRegistry.get('validators');

    validatorRegistry.set('Neos.Neos/Validation/AlphanumericValidator', Alphanumeric);
    validatorRegistry.set('Neos.Neos/Validation/CountValidator', Count);
    validatorRegistry.set('Neos.Neos/Validation/DateTimeValidator', DateTime);
    validatorRegistry.set('Neos.Neos/Validation/EmailAddressValidator', EmailAddress);
    validatorRegistry.set('Neos.Neos/Validation/FloatValidator', Float);
    validatorRegistry.set('Neos.Neos/Validation/IntegerValidator', Integer);
    validatorRegistry.set('Neos.Neos/Validation/LabelValidator', Label);
    validatorRegistry.set('Neos.Neos/Validation/NotEmptyValidator', NotEmpty);
    validatorRegistry.set('Neos.Neos/Validation/NumberRangeValidator', NumberRange);
    validatorRegistry.set('Neos.Neos/Validation/RegularExpressionValidator', RegularExpression);
    validatorRegistry.set('Neos.Neos/Validation/StringValidator', String);
    validatorRegistry.set('Neos.Neos/Validation/StringLengthValidator', StringLength);
    validatorRegistry.set('Neos.Neos/Validation/TextValidator', Text);
    validatorRegistry.set('Neos.Neos/Validation/UuidValidator', Uuid);
});
