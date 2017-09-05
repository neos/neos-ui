import {createSelector} from 'reselect';
import {$get} from 'plow-js';

export const shouldScrollIntoView = $get('ui.contentCanvas.shouldScrollIntoView');
export const getCurrentContentCanvasContextPath = $get('ui.contentCanvas.contextPath');
export const currentlyEditedPropertyName = $get('ui.contentCanvas.currentlyEditedPropertyName');

export const formattingUnderCursor = createSelector(
    [
        $get('ui.contentCanvas.formattingUnderCursor')
    ],
    formattingUnderCursor =>
        formattingUnderCursor.toJS()
);

export const documentNodeSelector = createSelector(
    [
        $get('ui.contentCanvas.contextPath'),
        $get('cr.nodes.byContextPath')
    ],
    (documentNodeContextPath, nodesByContextPath) => $get(documentNodeContextPath, nodesByContextPath)
);
