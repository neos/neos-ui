import Alphanumeric from '@neos-project/neos-ui-validators/src/Alphanumeric';
import Count from '@neos-project/neos-ui-validators/src/Count';
import DateTime from '@neos-project/neos-ui-validators/src/DateTime';
import EmailAddress from '@neos-project/neos-ui-validators/src/EmailAddress';
import Float from '@neos-project/neos-ui-validators/src/Float';
import Integer from '@neos-project/neos-ui-validators/src/Integer';
import Label from '@neos-project/neos-ui-validators/src/Label';
import NotEmpty from '@neos-project/neos-ui-validators/src/NotEmpty';
import NumberRange from '@neos-project/neos-ui-validators/src/NumberRange';
import RegularExpression from '@neos-project/neos-ui-validators/src/RegularExpression';
import String from '@neos-project/neos-ui-validators/src/String';
import StringLength from '@neos-project/neos-ui-validators/src/StringLength';
import Text from '@neos-project/neos-ui-validators/src/Text';
import Uuid from '@neos-project/neos-ui-validators/src/Uuid';

import manifest from '@neos-project/neos-ui-extensibility';
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
