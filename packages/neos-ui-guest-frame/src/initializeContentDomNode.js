import {$get} from 'plow-js';

import {
    getGuestFrameDocument,
    createEmptyContentCollectionPlaceholderIfMissing,
    findRelativePropertiesInGuestFrame
} from './dom';
import initializePropertyDomNode from './initializePropertyDomNode';

import style from './style.css';

export default ({store, globalRegistry, nodeTypesRegistry, inlineEditorRegistry, nodes}) => contentDomNode => {
    const contextPath = contentDomNode.getAttribute('data-__neos-node-contextpath');
    const isHidden = $get([contextPath, 'properties', '_hidden'], nodes);

    if (isHidden) {
        contentDomNode.classList.add(style.markHiddenNodeAsHidden);
    }

    contentDomNode.addEventListener('mouseenter', e => {
        const oldNode = getGuestFrameDocument().querySelector(`.${style.markHoveredNodeAsHovered}`);
        if (oldNode) {
            oldNode.classList.remove(style.markHoveredNodeAsHovered);
        }

        contentDomNode.classList.add(style.markHoveredNodeAsHovered);

        e.stopPropagation();
    });

    contentDomNode.addEventListener('mouseleave', e => {
        contentDomNode.classList.remove(style.markHoveredNodeAsHovered);

        e.stopPropagation();
    });

    if (contentDomNode.classList.contains('neos-contentcollection')) {
        createEmptyContentCollectionPlaceholderIfMissing(contentDomNode);
    }

    findRelativePropertiesInGuestFrame(contentDomNode).forEach(
        initializePropertyDomNode({
            store,
            globalRegistry,
            nodeTypesRegistry,
            inlineEditorRegistry,
            nodes
        })
    );
};
