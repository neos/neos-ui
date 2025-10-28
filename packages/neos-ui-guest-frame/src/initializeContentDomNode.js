import {
    getGuestFrameDocument,
    createEmptyContentCollectionPlaceholderIfMissing,
    createNotInlineEditableOverlay,
    findRelativePropertiesInGuestFrame
} from './dom';
import initializePropertyDomNode from './initializePropertyDomNode';

import style from './style.module.css';

/**
 * @param store
 * @param globalRegistry
 * @param nodeTypesRegistry
 * @param inlineEditorRegistry
 * @return {(function(NodeInGuestFrame): void)|*}
 * FIXME: Handle multiple content nodes when adding event listeners and classes
 */
export default ({store, globalRegistry, nodeTypesRegistry, inlineEditorRegistry}) => (node) => {
    const nodes = store.getState().cr.nodes.byContextPath;
    const {contentDomNode, nodeAddress} = node;

    if (!nodes[nodeAddress]) {
        // Node is not available in the store yet, so we can't initialize any interaction
        console.warn(`Node with context path "${nodeAddress}" is not available in the store yet.`);
        return;
    }

    const isHidden = nodes?.[nodeAddress]?.properties?._hidden;
    const hasChildren = Boolean(nodes?.[nodeAddress]?.children);
    const isInlineEditable = nodeTypesRegistry.isInlineEditable(nodes?.[nodeAddress]?.nodeType);
    const matchesCurrentDimensions = !nodes?.[nodeAddress]?.matchesCurrentDimensions;

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

    findRelativePropertiesInGuestFrame(node).forEach(
        initializePropertyDomNode({
            store,
            globalRegistry,
            nodeTypesRegistry,
            inlineEditorRegistry,
            nodes
        })
    );
};
