import manifest from 'Host/Extensibility/API/Manifest/index';

import TextField from './TextField/index';
import Boolean from './Boolean/index';
import DateTime from './DateTime/index';
import Image from './Image/index';

manifest('inspectorEditors', (registry) => {
    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/TextFieldEditor', {
        component: TextField
    });

    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/BooleanEditor', {
        component: Boolean,
        hasOwnLabel: true
    })

    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/DateTimeEditor', {
        component: DateTime
    })

    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/ImageEditor', {
        component: Image
    })

});
