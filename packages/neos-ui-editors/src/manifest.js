import TextField from './TextField/index';
import Boolean from './Boolean/index';
import DateTime from './DateTime/index';
import Image from './Image/index';
import SelectBox from './SelectBox/index';
import Link from './Link/index';
import Reference from './Reference/index';
import NodeType from './NodeType/index';
import CodeMirror from './CodeMirror/index';

import manifest from '@neos-project/neos-ui-extensibility';
import backend from '@neos-project/neos-ui-backend-connector';

manifest('inspectorEditors', {}, globalRegistry => {
    const editorsRegistry = globalRegistry.get('inspector').get('editors');
    const saveHooksRegistry = globalRegistry.get('inspector').get('saveHooks');
    const {createImageVariant} = backend.get().endpoints;

    editorsRegistry.add('Neos.Neos/Inspector/Editors/TextFieldEditor', {
        component: TextField
    });

    editorsRegistry.add('Neos.Neos/Inspector/Editors/TextAreaEditor', {
        component: TextField
    });

    editorsRegistry.add('Neos.Neos/Inspector/Editors/BooleanEditor', {
        component: Boolean,
        hasOwnLabel: true
    });

    editorsRegistry.add('Neos.Neos/Inspector/Editors/DateTimeEditor', {
        component: DateTime
    });

    editorsRegistry.add('Neos.Neos/Inspector/Editors/ImageEditor', {
        component: Image
    });

    editorsRegistry.add('Neos.Neos/Inspector/Editors/SelectBoxEditor', {
        component: SelectBox
    });

    editorsRegistry.add('Neos.Neos/Inspector/Editors/LinkEditor', {
        component: Link
    });

    editorsRegistry.add('Neos.Neos/Inspector/Editors/ReferenceEditor', {
        component: Reference
    });

    editorsRegistry.add('Neos.Neos/Inspector/Editors/NodeTypeEditor', {
        component: NodeType
    });

    editorsRegistry.add('Neos.Neos/Inspector/Editors/CodeEditor', {
        component: CodeMirror,
        hasOwnLabel: true
    });

    //
    // This hook will create an image variant right before changes to an image
    // are saved
    //
    saveHooksRegistry.add(
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
