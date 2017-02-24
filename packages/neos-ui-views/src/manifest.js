import NodeInfoView from './NodeInfoView/index';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('inspectorViews', {}, globalRegistry => {
    const viewsRegistry = globalRegistry.get('inspector').get('views');

    viewsRegistry.add('Neos.Neos/Inspector/Views/NodeInfoView', {
        component: NodeInfoView
    });
});
