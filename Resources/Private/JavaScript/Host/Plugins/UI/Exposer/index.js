import * as nodes from './Nodes/index';

const exposers = {
    ...nodes
};

export default () => Object.keys(exposers)
    .forEach(key => exposers[key]());
