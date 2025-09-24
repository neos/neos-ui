export {registerLinkTypes, registerDialog} from './application';

export type {IEditor, ILinkType} from './domain';
export {
    makeLinkType,
    useLinkTypeForHref,
    createEditor,
    createHrefWithAnchorForLink,
    parseBaseHrefAndAnchorFromValue,
} from './domain';

export {Deletable} from './presentation';
