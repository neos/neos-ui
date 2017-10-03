import {
    TextField,
    TextArea,
    Boolean,
    DateTime,
    Image,
    SelectBox,
    Link,
    Reference,
    References,
    NodeType,
    CodeMirror
} from './Editors/index';

import {
    CodeMirrorWrap,
    ImageCropper,
    MediaDetailsScreen,
    MediaSelectionScreen
} from './SecondaryEditors/index';

import manifest from '@neos-project/neos-ui-extensibility';
import backend from '@neos-project/neos-ui-backend-connector';

manifest('inspectorEditors', {}, globalRegistry => {
    const editorsRegistry = globalRegistry.get('inspector').get('editors');
    const secondaryEditorsRegistry = globalRegistry.get('inspector').get('secondaryEditors');
    const saveHooksRegistry = globalRegistry.get('inspector').get('saveHooks');
    const {createImageVariant} = backend.get().endpoints;

    //
    // Primary inspector editors
    //

    editorsRegistry.set('Neos.Neos/Inspector/Editors/TextFieldEditor', {
        component: TextField
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/TextAreaEditor', {
        component: TextArea
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/BooleanEditor', {
        component: Boolean,
        hasOwnLabel: true
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/DateTimeEditor', {
        component: DateTime
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/ImageEditor', {
        component: Image
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/SelectBoxEditor', {
        component: SelectBox
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/LinkEditor', {
        component: Link
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/ReferenceEditor', {
        component: Reference
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/ReferencesEditor', {
        component: References
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/NodeTypeEditor', {
        component: NodeType
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/CodeEditor', {
        component: CodeMirror,
        hasOwnLabel: true
    });

    //
    // Secondary inspector editors
    //

    secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/CodeMirrorWrap', {
        component: CodeMirrorWrap
    });

    secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/ImageCropper', {
        component: ImageCropper
    });

    secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/MediaDetailsScreen', {
        component: MediaDetailsScreen
    });

    secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen', {
        component: MediaSelectionScreen
    });

    //
    // This hook will create an image variant right before changes to an image
    // are saved
    //
    saveHooksRegistry.set(
        'Neos.UI:Hook.BeforeSave.CreateImageVariant',
        (value, options) => {
            const {__identity, adjustments, originalAsset} = options.object;

            const uuidOfImage = originalAsset ? originalAsset.__identity : __identity;
            if (!uuidOfImage) {
                return Promise.reject('Received malformed originalImageUuid.');
            }

            if (!adjustments) {
                return Promise.reject('Received malformed adjustments.');
            }

            return createImageVariant(uuidOfImage, adjustments);
        }
    );
});
