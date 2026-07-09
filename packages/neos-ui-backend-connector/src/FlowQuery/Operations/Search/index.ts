import {NodeTypeName} from '@neos-project/neos-ui-contentrepository-model';

export default () => (term: string, filterNodeType: NodeTypeName) => ({
    type: 'search',
    payload: [term, filterNodeType]
});
