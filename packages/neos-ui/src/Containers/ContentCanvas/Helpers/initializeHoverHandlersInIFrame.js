import style from '../style.css';

export default function initializeHoverHandlersInIframe(node, iframeDocument) {
    node.addEventListener('mouseenter', e => {
        const oldNode = iframeDocument.querySelector(`.${style.markHoveredNodeAsHovered}`);
        if (oldNode) {
            oldNode.classList.remove(style.markHoveredNodeAsHovered);
        }

        node.classList.add(style.markHoveredNodeAsHovered);

        e.stopPropagation();
    });
    node.addEventListener('mouseleave', e => {
        node.classList.remove(style.markHoveredNodeAsHovered);

        e.stopPropagation();
    });
}

