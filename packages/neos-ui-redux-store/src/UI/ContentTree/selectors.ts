import {$get} from 'plow-js';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

export const getToggled = (state: GlobalState) => $get(['ui', 'contentTree', 'toggled'], state);
export const getIsLoading = (state: GlobalState) => $get(['ui', 'contentTree', 'isLoading'], state);
