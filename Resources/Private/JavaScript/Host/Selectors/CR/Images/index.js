import {$get} from 'plow-js';
import {createSelector} from 'reselect';

export const imageByUuid = uuid => $get(['cr', 'images', 'byUuid', uuid]);

// TODO: selector is somehow broken; e.g. not called?
export const imageLookup = createSelector(
    [
        $get(['cr', 'images', 'byUuid'])
    ],
    images => imageUuid => {
        return $get(imageUuid, images);
    }
);
