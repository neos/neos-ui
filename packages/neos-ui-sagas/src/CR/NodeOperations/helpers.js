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
            const parentElement = element?.contentDomNode ? closestNodeInGuestFrame(element.contentDomNode.parentNode) : null;

            return {
                siblingDomAddress: {
                    contextPath: contextNode.contextPath,
                    fusionPath
                },
                parentDomAddress: parentElement ? {
                    contextPath: parentElement.nodeAddress,
                    fusionPath: parentElement.fusionPath
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
                    contextPath: element ? element.nodeAddress : contextNode.contextPath,
                    fusionPath: element ? element.fusionPath : fusionPath
                }
            };
        }
    }
};
