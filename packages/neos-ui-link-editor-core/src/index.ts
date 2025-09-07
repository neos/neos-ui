export {registerLinkTypes, registerDialog} from './application';

export type {IEditor, ILinkType} from './domain';
export {
    makeLinkType,
    useLinkTypeForHref,
    createEditor,
    EditorContext,
    useEditorState,
    useEditorTransactions
} from './domain';

export {Deletable} from './presentation';