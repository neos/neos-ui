import {findNodeInGuestFrame, closestNodeInGuestFrame} from '@neos-project/neos-ui-guest-frame/src/dom';

export const calculateChangeTypeFromMode = (mode, prefix) => {
    switch (mode) {
        case 'before':
            return `Neos.Neos.Ui:${prefix}Before`;

        case 'after':
            return `Neos.Neos.Ui:${prefix}After`;

        default:
            return `Neos.Neos.Ui:${prefix}Into`;
    }
};

export const calculateDomAddressesFromMode = (mode, contextNode, fusionPath) => {
    switch (mode) {
        case 'before':
        case 'after': {
            const element = findNodeInGuestFrame(contextNode.contextPath, fusionPath);
            const parentElement = element ? closestNodeInGuestFrame(element.parentNode) : null;

            return {
                siblingDomAddress: {
                    contextPath: contextNode.contextPath,
                    fusionPath
                },
                parentDomAddress: parentElement ? {
                    contextPath: parentElement.getAttribute('data-__neos-node-contextpath'),
                    fusionPath: parentElement.getAttribute('data-__neos-fusion-path')
                } : {
                    contextPath: contextNode.parent,
                    fusionPath: null
                }
            };
        }

        default: {
            const element = findNodeInGuestFrame(contextNode.contextPath, fusionPath);

            return {
                parentContextPath: contextNode.contextPath,
                parentDomAddress: {
                    contextPath: element ? element.getAttribute('data-__neos-node-contextpath') : contextNode.contextPath,
                    fusionPath: element ? element.getAttribute('data-__neos-fusion-path') : fusionPath
                }
            };
        }
    }
};
