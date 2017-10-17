import NodeInfoView from './NodeInfoView/index';
import DataColumnView from './Data/ColumnView/index';
import DataTableView from './Data/TableView/index';
import TimeSeriesView from './Data/TimeSeriesView/index';

import manifest from '@neos-project/neos-ui-extensibility';

manifest('inspectorViews', {}, globalRegistry => {
    const viewsRegistry = globalRegistry.get('inspector').get('views');

    viewsRegistry.set('Neos.Neos/Inspector/Views/NodeInfoView', {
        component: NodeInfoView
    });
    viewsRegistry.set('Neos.Neos/Inspector/Views/Data/ColumnView', {
        component: DataColumnView,
        hasOwnLabel: true
    });
    viewsRegistry.set('Neos.Neos/Inspector/Views/Data/TableView', {
        component: DataTableView,
        hasOwnLabel: true
    });
    viewsRegistry.set('Neos.Neos/Inspector/Views/Data/TimeSeriesView', {
        component: TimeSeriesView,
        hasOwnLabel: true
    });
});
