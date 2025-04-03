import {GlobalState} from '../../System';

export const shouldScrollIntoView = (state: GlobalState) => state?.ui?.contentCanvas?.shouldScrollIntoView;

export const currentlyEditedPropertyName = (state: GlobalState) => state?.ui?.contentCanvas?.currentlyEditedPropertyName;

export const formattingUnderCursor = (state: GlobalState) => state?.ui?.contentCanvas?.formattingUnderCursor;

export const isLinkEditorOpen = (state: GlobalState) => state?.ui?.contentCanvas?.isLinkEditorOpen;

export const selectors = {};
