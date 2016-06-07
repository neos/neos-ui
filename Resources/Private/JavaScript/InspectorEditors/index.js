import api from '@host';

import TextField from './TextField/index';
import Boolean from './Boolean/index';
import DateTime from './DateTime/index';
import ImageEditor from './Image/index';
import TextArea from './TextArea/index';
import SelectBox from './SelectBox/index';
import NodeType from './NodeType/index';

const {createInspectorEditor, createHook} = api;

/**
 * Every editor gets passed in:
 * - value: the value to display
 * - onChange: the callback if something changed.
 */


//
// TextField
//
createInspectorEditor(
    'Neos.UI:Inspector.TextField',
    'TYPO3.Neos/Inspector/Editors/TextFieldEditor',
    TextField
);

//
// Boolean
//
createInspectorEditor(
    'Neos.UI:Inspector.Boolean',
    'TYPO3.Neos/Inspector/Editors/BooleanEditor',
    Boolean
);

//
// DateTime
//
createInspectorEditor(
    'Neos.UI:Inspector.DateTime',
    'TYPO3.Neos/Inspector/Editors/DateTimeEditor',
    DateTime
);

//
// Image
//
createInspectorEditor(
    'Neos.UI:Inspector.Image',
    'TYPO3.Neos/Inspector/Editors/ImageEditor',
    ImageEditor
);

createHook(
    //
    // This hook will create an image variant right before changes to an image
    // are saved
    //
    'Neos.UI:Hook.BeforeSave.CreateImageVariant',
    (value, options) => {
        const {createVariant} = api.media.image;
        const {__identity, adjustments, originalAsset} = options.object;

        return createVariant(originalAsset ? originalAsset.__identity : __identity, adjustments);
    }
);

//
// TextArea
//
createInspectorEditor(
    'Neos.UI:Inspector.TextArea',
    'TYPO3.Neos/Inspector/Editors/TextAreaEditor',
    TextArea
);

//
// SelectBox
//
createInspectorEditor(
    'Neos.UI:Inspector.SelectBox',
    'TYPO3.Neos/Inspector/Editors/SelectBoxEditor',
    SelectBox
);

//
// NodeType
//
createInspectorEditor(
    'Neos.UI:Inspector.NodeType',
    'TYPO3.Neos/Inspector/Editors/NodeTypeEditor',
    NodeType
);

createInspectorEditor(
    'Neos.UI:Inspector.NodeType',
    'Content/Inspector/Editors/NodeTypeEditor',
    NodeType
);
