import {NodeTypeName} from '@neos-project/neos-ts-interfaces';

export default () => (term: string, filterNodeType: NodeTypeName) => ({
    type: 'search',
    payload: [term, filterNodeType]
});
