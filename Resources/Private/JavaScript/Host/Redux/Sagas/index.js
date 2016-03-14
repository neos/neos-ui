import UI from './UI/index';
import * as Changes from './Changes/index';

export default [
    ...UI,
    ...Object.keys(Changes).map(k => Changes[k])
];
