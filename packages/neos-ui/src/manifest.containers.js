import manifest from '@neos-project/neos-ui-extensibility';

import App from './Containers/App';

import Modals from './Containers/Modals/index';
import DeleteNodeModal from './Containers/Modals/DeleteNode/index';
import InsertModeModal from './Containers/Modals/InsertMode/index';
import SelectNodeTypeModal from './Containers/Modals/SelectNodeType/index';
import NodeCreationDialog from './Containers/Modals/NodeCreationDialog/index';
import NodeVariantCreationDialog from './Containers/Modals/NodeVariantCreationDialog/index';

import FullScreen from './Containers/FullScreen/index';

import PrimaryToolbar from './Containers/PrimaryToolbar/index';
import UserDropDown from './Containers/PrimaryToolbar/UserDropDown/index';
import PublishDropDown from './Containers/PrimaryToolbar/PublishDropDown/index';
import MenuToggler from './Containers/PrimaryToolbar/MenuToggler/index';
import LeftSideBarToggler from './Containers/PrimaryToolbar/LeftSideBarToggler/index';
import EditModePanelToggler from './Containers/PrimaryToolbar/EditModePanelToggler/index';

import EditModePanel from './Containers/EditModePanel/index';

import SecondaryToolbar from './Containers/SecondaryToolbar/index';
import DimensionSwitcher from './Containers/SecondaryToolbar/DimensionSwitcher/index';
import LoadingIndicator from './Containers/SecondaryToolbar/LoadingIndicator/index';

import Drawer from './Containers/Drawer/index';

import LeftSideBar from './Containers/LeftSideBar/index';
import {PageTreeToolbar, ContentTreeToolbar} from './Containers/LeftSideBar/NodeTreeToolBar/index';
import {PageTree, ContentTree} from './Containers/LeftSideBar/NodeTree/index';
import {PageTreeSearchbar} from './Containers/LeftSideBar/NodeTreeSearchBar/index';

import ContentCanvas from './Containers/ContentCanvas/index';

import RightSideBar from './Containers/RightSideBar/index';
import Inspector from './Containers/RightSideBar/Inspector/index';

manifest('main.containers', {}, globalRegistry => {
    const containerRegistry = globalRegistry.get('containers');

    containerRegistry.add('App', App);

    containerRegistry.add('Modals', Modals);
    containerRegistry.add('Modals/DeleteNodeModal', DeleteNodeModal);
    containerRegistry.add('Modals/InsertModeModal', InsertModeModal);
    containerRegistry.add('Modals/SelectNodeTypeModal', SelectNodeTypeModal);
    containerRegistry.add('Modals/NodeCreationDialog', NodeCreationDialog);
    containerRegistry.add('Modals/NodeVariantCreationDialog', NodeVariantCreationDialog);

    containerRegistry.add('FullScreen', FullScreen);

    containerRegistry.add('PrimaryToolbar', PrimaryToolbar);
    containerRegistry.add('PrimaryToolbar/UserDropDown', UserDropDown);
    containerRegistry.add('PrimaryToolbar/PublishDropDown', PublishDropDown);
    containerRegistry.add('PrimaryToolbar/MenuToggler', MenuToggler);
    containerRegistry.add('PrimaryToolbar/LeftSideBarToggler', LeftSideBarToggler);
    containerRegistry.add('PrimaryToolbar/EditModePanelToggler', EditModePanelToggler);

    containerRegistry.add('EditModePanel', EditModePanel);

    containerRegistry.add('SecondaryToolbar', SecondaryToolbar);
    containerRegistry.add('SecondaryToolbar/DimensionSwitcher', DimensionSwitcher);
    containerRegistry.add('SecondaryToolbar/LoadingIndicator', LoadingIndicator);

    containerRegistry.add('Drawer', Drawer);

    containerRegistry.add('LeftSideBar', LeftSideBar);
    containerRegistry.add('LeftSideBar/PageTreeToolbar', PageTreeToolbar);
    containerRegistry.add('LeftSideBar/PageTree', PageTree);
    containerRegistry.add('LeftSideBar/PageTreeSearchbar', PageTreeSearchbar);
    containerRegistry.add('LeftSideBar/ContentTreeToolbar', ContentTreeToolbar);
    containerRegistry.add('LeftSideBar/ContentTree', ContentTree);

    containerRegistry.add('ContentCanvas', ContentCanvas);

    containerRegistry.add('RightSideBar', RightSideBar);
    containerRegistry.add('RightSideBar/Inspector', Inspector);
});
