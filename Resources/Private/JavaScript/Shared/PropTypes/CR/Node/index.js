import {PropTypes} from 'react';

import {nodeType} from '../NodeType/index';

const nodeShape = {
    contextPath: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    isAutoCreated: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    uri: PropTypes.string
};

export const storedNode = PropTypes.shape({
    ...nodeShape,
    nodeType: PropTypes.string.isRequired
});

export const node = PropTypes.shape({
    ...nodeShape,
    nodeType: nodeType.isRequired
});

export const documentNode = PropTypes.shape({
    ...nodeShape,
    nodeType: nodeType.isRequired,
    uri: PropTypes.string.isRequired
});
