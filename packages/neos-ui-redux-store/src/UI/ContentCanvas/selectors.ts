import {$get} from 'plow-js';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

export const shouldScrollIntoView = (state: GlobalState) => $get(['ui', 'contentCanvas', 'shouldScrollIntoView'], state);

export const currentlyEditedPropertyName = (state: GlobalState) => $get(['ui', 'contentCanvas', 'currentlyEditedPropertyName'], state);

export const formattingUnderCursor = (state: GlobalState) => $get(['ui', 'contentCanvas', 'formattingUnderCursor'], state);

export const selectors = {};
