export type {ILink, ILinkOptions} from './Link';
export {
    createHrefWithAnchorForLink,
    parseBaseHrefAndAnchorFromValue
} from './Link';

export type {ILinkType} from './LinkType';
export {
    makeLinkType,
    useLinkTypes,
    useLinkTypeForHref,
    useSortedAndFilteredLinkTypes
} from './LinkType';
