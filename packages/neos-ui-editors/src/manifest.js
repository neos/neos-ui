import * as Editors from './index';

import manifest from '@neos-project/neos-ui-extensibility';
import backend from '@neos-project/neos-ui-backend-connector';

import LinkInputOptions from './Library/LinkInputOptions';

export default Editors.EditorEnvelope;

manifest('inspectorEditors', {}, globalRegistry => {
    const editorsRegistry = globalRegistry.get('inspector').get('editors');
    const secondaryEditorsRegistry = globalRegistry.get('inspector').get('secondaryEditors');
    const saveHooksRegistry = globalRegistry.get('inspector').get('saveHooks');
    const containerRegistry = globalRegistry.get('containers');
    const {createImageVariant} = backend.get().endpoints;

    //
    // Primary inspector editors
    //

    editorsRegistry.set('Neos.Neos/Inspector/Editors/TextFieldEditor', {
        component: Editors.TextField
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/TextAreaEditor', {
        component: Editors.TextArea
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/BooleanEditor', {
        component: Editors.Boolean,
        hasOwnLabel: true
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/DateTimeEditor', {
        component: Editors.DateTime
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/ImageEditor', {
        component: Editors.Image
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/SelectBoxEditor', {
        component: Editors.SelectBox
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/LinkEditor', {
        component: Editors.Link
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/ReferenceEditor', {
        component: Editors.Reference
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/ReferencesEditor', {
        component: Editors.References
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/NodeTypeEditor', {
        component: Editors.NodeType
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/CodeEditor', {
        component: Editors.CodeMirror,
        hasOwnLabel: true
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/RichTextEditor', {
        component: Editors.CKEditor,
        hasOwnLabel: true
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/AssetEditor', {
        component: Editors.AssetEditor
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/MasterPluginEditor', {
        component: Editors.MasterPlugin
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/PluginViewsEditor', {
        component: Editors.PluginViews,
        hasOwnLabel: true
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/PluginViewEditor', {
        component: Editors.PluginView
    });

    editorsRegistry.set('Neos.Neos/Inspector/Editors/UriPathSegmentEditor', {
        component: Editors.UriPathSegment
    });

    //
    // Secondary inspector editors
    //

    secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/CodeMirrorWrap', {
        component: Editors.CodeMirrorWrap
    });

    secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/CKEditorWrap', {
        component: Editors.CKEditorWrap
    });

    secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/ImageCropper', {
        component: Editors.ImageCropper
    });

    secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/MediaDetailsScreen', {
        component: Editors.MediaDetailsScreen
    });

    secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen', {
        component: Editors.MediaSelectionScreen
    });

    //
    // LinkInput options panel containers.
    // Feel free to add additional custom options here
    //
    containerRegistry.set('LinkInput/OptionsPanel/DefaultLinkInputOptions', LinkInputOptions);

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
                return Promise.reject(new Error('Received malformed originalImageUuid.'));
            }

            if (!adjustments) {
                return Promise.reject(new Error('Received malformed adjustments.'));
            }

            return createImageVariant(uuidOfImage, adjustments);
        }
    );
});
