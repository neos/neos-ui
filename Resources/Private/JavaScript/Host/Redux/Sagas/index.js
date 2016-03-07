import UI from './UI/';
import * as Changes from './Changes/';

export default [
    ...UI,
    ...Object.keys(Changes).map(k => Changes[k])
];
