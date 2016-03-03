import {$get, $set} from 'plow-js';

export const byNameSelector = name => $get(['cr', 'nodeTypes', 'byName', name]);
