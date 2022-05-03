import Alphanumeric from './Alphanumeric';
import Count from './Count';
import DateTime from './DateTime';
import EmailAddress from './EmailAddress';
import Float from './Float';
import Integer from './Integer';
import Label from './Label';
import NotEmpty from './NotEmpty';
import NumberRange from './NumberRange';
import RegularExpression from './RegularExpression';
import String from './String';
import StringLength from './StringLength';
import Text from './Text';
import Uuid from './Uuid';

import manifest from '@neos-project/neos-ui-extensibility/src';
import {GlobalRegistry} from '@neos-project/neos-ts-interfaces';

manifest('validators', {}, (globalRegistry: GlobalRegistry) => {
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
