import NodeInfoView from './NodeInfoView/index';
import DataColumnView from './Data/ColumnView/index';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('inspectorViews', {}, globalRegistry => {
    const viewsRegistry = globalRegistry.get('inspector').get('views');

    viewsRegistry.set('Neos.Neos/Inspector/Views/NodeInfoView', {
        component: NodeInfoView
    });
    viewsRegistry.set('Neos.Neos/Inspector/Views/Data/ColumnView', {
        component: DataColumnView
    });
});
