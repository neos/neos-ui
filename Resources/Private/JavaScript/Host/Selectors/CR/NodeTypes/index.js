import {$get, $set} from 'plow-js';

export const byNameSelector = state => name => $get(['cr', 'nodeTypes', 'byName', name], state);
export const subTypesSelector = name => $get(['cr', 'nodeTypes', 'inheritanceMap', 'subTypes', name]);
