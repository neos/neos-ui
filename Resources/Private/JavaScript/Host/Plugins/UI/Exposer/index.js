import * as nodes from './Nodes/';

const exposers = {
    ...nodes
};

export default () => Object.keys(exposers)
    .forEach(key => exposers[key]());
