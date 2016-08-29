import manifest from 'Host/Extensibility/API/Manifest/index';
import {createImageVariant} from 'Host/Extensibility/API/Endpoints/index';

import TextField from './TextField/index';
import Boolean from './Boolean/index';
import DateTime from './DateTime/index';
import Image from './Image/index';

manifest('inspectorEditors', registry => {
    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/TextFieldEditor', {
        component: TextField
    });

    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/BooleanEditor', {
        component: Boolean,
        hasOwnLabel: true
    });

    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/DateTimeEditor', {
        component: DateTime
    });

    registry.inspector.editors.add('TYPO3.Neos/Inspector/Editors/ImageEditor', {
        component: Image
    });

    //
    // This hook will create an image variant right before changes to an image
    // are saved
    //
    registry.inspector.saveHooks.add('Neos.UI:Hook.BeforeSave.CreateImageVariant', (value, options) => {
        const {__identity, adjustments, originalAsset} = options.object;

        const uuidOfImage = originalAsset ? originalAsset.__identity : __identity;
        if (!uuidOfImage) {
            return Promise.reject('Received malformed originalImageUuid.');
        }

        if (!adjustments) {
            return Promise.reject('Received malformed adjustments.');
        }

        return createImageVariant(uuidOfImage, adjustments);
    });
});
