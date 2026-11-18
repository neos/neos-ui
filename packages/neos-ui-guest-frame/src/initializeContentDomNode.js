import {$get, $count} from 'plow-js';

import {
    createEmptyContentCollectionPlaceholderIfMissing,
    createNotInlineEditableOverlay,
    findRelativePropertiesInGuestFrame
} from './dom';
import initializePropertyDomNode from './initializePropertyDomNode';

import style from './style.module.css';

//
// `nodes` and `propertiesByContextPath` are optional pre-computed lookups, so that initializing
// many nodes at once does not have to re-read the store and re-query the guest frame's DOM for
// every single node.
//
export default ({
    store,
    globalRegistry,
    nodeTypesRegistry,
    inlineEditorRegistry,
    nodes: precomputedNodesFromDependencies
}) => (contentDomNode, {nodes: precomputedNodes, propertiesByContextPath} = {}) => {
    const contextPath = contentDomNode.getAttribute('data-__neos-node-contextpath');
    const precomputedNodesToUse = precomputedNodes || precomputedNodesFromDependencies;
    // The pre-computed nodes may be outdated, as nodes can be merged into the store while the
    // initialization is still running, so we fall back to a fresh read.
    const nodes = precomputedNodesToUse && precomputedNodesToUse[contextPath] ?
        precomputedNodesToUse :
        store.getState().cr.nodes.byContextPath;

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

    if (contentDomNode.classList.contains('neos-contentcollection')) {
        createEmptyContentCollectionPlaceholderIfMissing(contentDomNode);
    }

    const propertyDomNodes = propertiesByContextPath ?
        (propertiesByContextPath[contextPath] || []) :
        findRelativePropertiesInGuestFrame(contentDomNode);

    const initializeCurrentPropertyDomNode = initializePropertyDomNode({
        store,
        globalRegistry,
        nodeTypesRegistry,
        inlineEditorRegistry,
        nodes
    });

    propertyDomNodes.forEach(initializeCurrentPropertyDomNode);
};
