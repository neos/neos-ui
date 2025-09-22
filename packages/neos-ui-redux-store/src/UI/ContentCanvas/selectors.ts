import {GlobalState} from '../../..';

export const shouldScrollIntoView = (state: GlobalState) => state?.ui?.contentCanvas?.shouldScrollIntoView;

export const currentlyEditedPropertyName = (state: GlobalState) => state?.ui?.contentCanvas?.currentlyEditedPropertyName;

export const formattingUnderCursor = (state: GlobalState) => state?.ui?.contentCanvas?.formattingUnderCursor;

export const selectors = {};
