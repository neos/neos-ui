import manifest from '@neos-project/neos-ui-extensibility';

import {NodeTypesRegistry} from './registry';

manifest('@neos-project/neos-ui-contentrepository', {}, globalRegistry => {
    globalRegistry.add(
        '@neos-project/neos-ui-contentrepository',
        new NodeTypesRegistry(`
            # Registry for Neos.ContentRepository NodeTypes
        `)
    );
});
