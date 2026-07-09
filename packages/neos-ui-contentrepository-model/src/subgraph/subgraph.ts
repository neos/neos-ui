import {WorkspaceName} from '../workspace';
import {NodeContextPath} from '../node';

// TODO Rename to SubgraphAddress and align to Neos ESCR model
export interface ContextProperties {
    contextPath?: NodeContextPath;
    workspaceName?: WorkspaceName;
    invisibleContentShown?: boolean;
    removedContentShown?: boolean;
}
