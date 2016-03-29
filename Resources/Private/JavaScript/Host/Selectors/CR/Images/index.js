import {$get, $set} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

import {
    byNameSelector as nodeTypeByNameSelector,
    subTypesSelector
} from '../NodeTypes/index';

// TODO: create selector here?
export const imageByUuid = uuid => $get(['cr', 'images', 'byUuid', uuid]);