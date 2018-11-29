import {createSelector} from 'reselect';
import {$get} from 'plow-js';

export const shouldScrollIntoView = $get('ui.contentCanvas.shouldScrollIntoView');

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
        $get('cr.nodes.documentNode'),
        $get('cr.nodes.byContextPath')
    ],
    (documentNodeContextPath, nodesByContextPath) => documentNodeContextPath ? $get(documentNodeContextPath, nodesByContextPath) : null
);
