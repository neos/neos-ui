import manifest from '@neos-project/neos-ui-extensibility';

import Modals from './Containers/Modals/index';
import DeleteNodeModal from './Containers/Modals/DeleteNode/index';
import InsertModeModal from './Containers/Modals/InsertMode/index';
import SelectNodeTypeModal from './Containers/Modals/SelectNodeType/index';
import NodeCreationDialog from './Containers/Modals/NodeCreationDialog/index';
import FullScreen from './Containers/FullScreen/index';
import PrimaryToolbar from './Containers/PrimaryToolbar/index';
import EditModePanel from './Containers/EditModePanel/index';
import SecondaryToolbar from './Containers/SecondaryToolbar/index';
import Drawer from './Containers/Drawer/index';
import LeftSideBar from './Containers/LeftSideBar/index';
import ContentCanvas from './Containers/ContentCanvas/index';
import RightSideBar from './Containers/RightSideBar/index';

manifest('main.containers', {}, globalRegistry => {
    const containerRegistry = globalRegistry.get('containers');

    containerRegistry.add('Modals', Modals);
    containerRegistry.add('Modals/DeleteNodeModal', DeleteNodeModal);
    containerRegistry.add('Modals/InsertModeModal', InsertModeModal);
    containerRegistry.add('Modals/SelectNodeTypeModal', SelectNodeTypeModal);
    containerRegistry.add('Modals/NodeCreationDialog', NodeCreationDialog);

    containerRegistry.add('FullScreen', FullScreen);
    containerRegistry.add('PrimaryToolbar', PrimaryToolbar);
    containerRegistry.add('EditModePanel', EditModePanel);
    containerRegistry.add('SecondaryToolbar', SecondaryToolbar);
    containerRegistry.add('Drawer', Drawer);
    containerRegistry.add('LeftSideBar', LeftSideBar);
    containerRegistry.add('ContentCanvas', ContentCanvas);
    containerRegistry.add('RightSideBar', RightSideBar);
});
