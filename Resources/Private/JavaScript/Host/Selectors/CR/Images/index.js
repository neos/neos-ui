import {$get, $set} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

import {
    byNameSelector as nodeTypeByNameSelector,
    subTypesSelector
} from '../NodeTypes/index';

// TODO: create selector here?
export const imageByUuid = uuid => $get(['cr', 'images', 'byUuid', uuid]);


// TODO: selector is somehow broken?!
export const imageLookup = createSelector(
    [
        $get(['cr', 'images', 'byUuid'])
    ],
    images => imageUuid => {
        console.log("Image Lookup: ", imageUuid, images, $get(imageUuid, images));
        return $get(imageUuid, images)
    }
);