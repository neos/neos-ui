import {$get, $count} from 'plow-js';

import {
    getGuestFrameDocument,
    createEmptyContentCollectionPlaceholderIfMissing,
    createNotInlineEditableOverlay,
    findRelativePropertiesInGuestFrame
} from './dom';
import initializePropertyDomNode from './initializePropertyDomNode';

import style from './style.module.css';

export default ({store, globalRegistry, nodeTypesRegistry, inlineEditorRegistry}) => contentDomNode => {
    const nodes = store.getState().cr.nodes.byContextPath;
    const contextPath = contentDomNode.getAttribute('data-__neos-node-contextpath');

    if (!nodes[contextPath]) {
        // Node is not available in the store yet, so we can't initialize any interaction
        console.warn(`Node with context path "${contextPath}" is not available in the store yet.`);
        return;
    }

    const isHidden = $get([contextPath, 'properties', '_hidden'], nodes);
    const hasChildren = Boolean($count([contextPath, 'children'], nodes));
    const isInlineEditable = nodeTypesRegistry.isInlineEditable($get([contextPath, 'nodeType'], nodes));
    const matchesCurrentDimensions = !$get([contextPath, 'matchesCurrentDimensions'], nodes);

    if (isHidden) {
        contentDomNode.classList.add(style.markHiddenNodeAsHidden);
    }

    if (!isInlineEditable && !hasChildren) {
        createNotInlineEditableOverlay(contentDomNode);
    }

    if (matchesCurrentDimensions) {
        /**
         * Adding legacy class for content elements shining through
         * @see Neos\Neos\Service\ContentElementWrappingService::addCssClasses()
         */
        contentDomNode.classList.add('neos-contentelement-shine-through');
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
