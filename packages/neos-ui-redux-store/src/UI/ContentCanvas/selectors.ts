import {$get} from 'plow-js';
import {GlobalState} from '../../System';
import {selectors as editPreviewModeSelectors} from '../EditPreviewMode';

export const shouldScrollIntoView = (state: GlobalState) => $get(['ui', 'contentCanvas', 'shouldScrollIntoView'], state);

export const currentlyEditedPropertyName = (state: GlobalState) => $get(['ui', 'contentCanvas', 'currentlyEditedPropertyName'], state);

export const formattingUnderCursor = (state: GlobalState) => $get(['ui', 'contentCanvas', 'formattingUnderCursor'], state);

export const isLinkEditorOpen = (state: GlobalState) => $get(['ui', 'contentCanvas', 'isLinkEditorOpen'], state);

export const src = (state: GlobalState) => {
    const src = state?.ui?.contentCanvas?.src;
    if (src === null || src === '') {
        return src;
    }
    const contentCanvasUri = new URL(src);
    const editPreviewMode = editPreviewModeSelectors.currentEditPreviewMode(state);
    contentCanvasUri.searchParams.set('editPreviewMode', editPreviewMode);
    return contentCanvasUri.toString();
};

export const selectors = {};
