import UI from './UI/index';
import * as Changes from './Changes/index';
import * as Publish from './Publish/index';

export default [
    ...UI,
    ...Object.keys(Changes).map(k => Changes[k]),
    ...Object.keys(Publish).map(k => Publish[k])
];
