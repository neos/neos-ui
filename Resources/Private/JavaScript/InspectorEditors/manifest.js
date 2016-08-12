import manifest from 'Host/Extensibility/API/Manifest/index';

import TextField from './TextField/index';
import Boolean from './Boolean/index';

manifest('inspectorEditors', (registry) => {
    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/TextFieldEditor', {
        component: TextField
    });

    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/BooleanEditor', {
        component: Boolean,
        hasOwnLabel: true
    })

});
