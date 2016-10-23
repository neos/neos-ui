import {createSelector} from 'reselect';
import {$get} from 'plow-js';

export const currentlyEditedPropertyName = $get('ui.contentCanvas.currentlyEditedPropertyName');

export const formattingUnderCursor = createSelector(
    [
        $get('ui.contentCanvas.formattingUnderCursor')
    ],
    formattingUnderCursor =>
        formattingUnderCursor.toJS()
);
