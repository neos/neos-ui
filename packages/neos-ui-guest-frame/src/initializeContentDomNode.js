import {
    getGuestFrameDocument,
    createEmptyContentCollectionPlaceholderIfMissing,
    createNotInlineEditableOverlay,
    findRelativePropertiesInGuestFrame
} from './dom';
import initializePropertyDomNode from './initializePropertyDomNode';

import style from './style.module.css';

export default ({store, globalRegistry, nodeTypesRegistry, inlineEditorRegistry, nodes}) => contentDomNode => {
    const contextPath = contentDomNode.getAttribute('data-__neos-node-contextpath');

    if (!nodes[contextPath]) {
        // Node is not available in the store yet, so we can't initialize any interaction
        console.warn(`Node with context path "${contextPath}" is not available in the store yet.`);
        return;
    }

    const isHidden = nodes?.[contextPath]?.properties?._hidden;
    const hasChildren = Boolean(nodes?.[contextPath]?.children);
    const isInlineEditable = nodeTypesRegistry.isInlineEditable(nodes?.[contextPath]?.nodeType);
    const matchesCurrentDimensions = !nodes?.[contextPath]?.matchesCurrentDimensions;

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
