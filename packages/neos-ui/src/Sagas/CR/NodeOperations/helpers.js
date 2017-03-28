import {dom} from '../../../Containers/ContentCanvas/Helpers/index';
import style from '../../../Containers/ContentCanvas/style.css';

export {dom, style};

export const parentNodeContextPath = contextPath => {
    if (typeof contextPath !== 'string') {
        return null;
    }

    const [path, context] = contextPath.split('@');

    return `${path.substr(0, path.lastIndexOf('/'))}@${context}`;
};

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

export const calculateDomAddressesFromMode = (mode, contextPath, fusionPath) => {
    switch (mode) {
        case 'before':
        case 'after': {
            const element = dom.findNode(contextPath, fusionPath);
            const parentElement = element ? dom.closestNode(element.parentNode) : null;

            return {
                siblingDomAddress: {
                    contextPath,
                    fusionPath
                },
                parentDomAddress: parentElement ? {
                    contextPath: parentElement.getAttribute('data-__neos-node-contextpath'),
                    fusionPath: parentElement.getAttribute('data-__neos-fusion-path')
                } : {
                    contextPath: parentNodeContextPath(contextPath),
                    fusionPath: null
                }
            };
        }

        default: {
            const element = dom.findNode(contextPath, fusionPath);

            return {
                parentDomAddress: {
                    contextPath: element? element.getAttribute('data-__neos-node-contextpath'): contextPath,
                    fusionPath: element ? element.getAttribute('data-__neos-fusion-path') : fusionPath
                }
            };
        }
    }
};
