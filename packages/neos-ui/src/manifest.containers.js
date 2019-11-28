import manifest from '@neos-project/neos-ui-extensibility';

import App from './Containers/App';

import Modals from './Containers/Modals/index';
import DiscardDialog from './Containers/Modals/DiscardDialog/index';
import DeleteNodeModal from './Containers/Modals/DeleteNode/index';
import InsertModeModal from './Containers/Modals/InsertMode/index';
import SelectNodeTypeModal from './Containers/Modals/SelectNodeType/index';
import NodeCreationDialog from './Containers/Modals/NodeCreationDialog/index';
import NodeVariantCreationDialog from './Containers/Modals/NodeVariantCreationDialog/index';
import ReloginDialog from './Containers/Modals/ReloginDialog/index';
import KeyboardShortcutModal from './Containers/Modals/KeyboardShortcutModal/index';
import UnappliedChangesDialog from './Containers/Modals/UnappliedChangesDialog/index';

import PrimaryToolbar from './Containers/PrimaryToolbar/index';
import DimensionSwitcher from './Containers/PrimaryToolbar/DimensionSwitcher/index';
import UserDropDown from './Containers/PrimaryToolbar/UserDropDown/index';
import PublishDropDown from './Containers/PrimaryToolbar/PublishDropDown/index';
import MenuToggler from './Containers/PrimaryToolbar/MenuToggler/index';
import Brand from './Containers/PrimaryToolbar/Brand/index';
import EditPreviewDropDown from './Containers/PrimaryToolbar/EditPreviewDropDown/index';

import SecondaryToolbar from './Containers/SecondaryToolbar/index';
import LoadingIndicator from './Containers/SecondaryToolbar/LoadingIndicator/index';
import KeyboardShortcutButton from './Containers/SecondaryToolbar/KeyboardShortcutButton/index';
import PreviewButton from './Containers/SecondaryToolbar/PreviewButton/index';
import FullScreenButton from './Containers/SecondaryToolbar/FullScreenButton/index';

import Drawer from './Containers/Drawer/index';
import VersionPanel from './Containers/Drawer/VersionPanel/index';

import LeftSideBar from './Containers/LeftSideBar/index';
import {PageTreeToolbar, ContentTreeToolbar} from './Containers/LeftSideBar/NodeTreeToolBar/index';
import {PageTree, ContentTree} from './Containers/LeftSideBar/NodeTree/index';
import {PageTreeSearchbar} from './Containers/LeftSideBar/NodeTreeSearchBar/index';

import ContentCanvas from './Containers/ContentCanvas/index';

import RightSideBar from './Containers/RightSideBar/index';
import Inspector from './Containers/RightSideBar/Inspector/index';

manifest('main.containers', {}, globalRegistry => {
    const containerRegistry = globalRegistry.get('containers');

    containerRegistry.set('App', App);

    containerRegistry.set('Modals', Modals);
    containerRegistry.set('Modals/DiscardDialog', DiscardDialog);
    containerRegistry.set('Modals/DeleteNodeModal', DeleteNodeModal);
    containerRegistry.set('Modals/InsertModeModal', InsertModeModal);
    containerRegistry.set('Modals/SelectNodeTypeModal', SelectNodeTypeModal);
    containerRegistry.set('Modals/NodeCreationDialog', NodeCreationDialog);
    containerRegistry.set('Modals/NodeVariantCreationDialog', NodeVariantCreationDialog);
    containerRegistry.set('Modals/ReloginDialog', ReloginDialog);
    containerRegistry.set('Modals/KeyboardShortcutModal', KeyboardShortcutModal);
    containerRegistry.set('Modals/UnappliedChangesDialog', UnappliedChangesDialog);

    containerRegistry.set('PrimaryToolbar', PrimaryToolbar);
    containerRegistry.set('PrimaryToolbar/Left/MenuToggler', MenuToggler);
    containerRegistry.set('PrimaryToolbar/Left/Brand', Brand);
    containerRegistry.set('PrimaryToolbar/Right/EditPreviewDropDown', EditPreviewDropDown);
    containerRegistry.set('PrimaryToolbar/Right/DimensionSwitcher', DimensionSwitcher);
    containerRegistry.set('PrimaryToolbar/Right/UserDropDown', UserDropDown);
    containerRegistry.set('PrimaryToolbar/Right/PublishDropDown', PublishDropDown);

    containerRegistry.set('SecondaryToolbar', SecondaryToolbar);
    containerRegistry.set('SecondaryToolbar/LoadingIndicator', LoadingIndicator);
    containerRegistry.set('SecondaryToolbar/Right/KeyboardShortcutButton', KeyboardShortcutButton);
    containerRegistry.set('SecondaryToolbar/Right/PreviewButton', PreviewButton);
    containerRegistry.set('SecondaryToolbar/Right/FullScreenButton', FullScreenButton);

    containerRegistry.set('Drawer', Drawer);
    containerRegistry.set('Drawer/Bottom/VersionPanel', VersionPanel);

    containerRegistry.set('LeftSideBar', LeftSideBar);
    containerRegistry.set('LeftSideBar/Top/PageTreeToolbar', PageTreeToolbar);
    containerRegistry.set('LeftSideBar/Top/PageTreeSearchbar', PageTreeSearchbar);
    containerRegistry.set('LeftSideBar/Top/PageTree', PageTree);
    containerRegistry.set('LeftSideBar/ContentTreeToolbar', ContentTreeToolbar);
    containerRegistry.set('LeftSideBar/Bottom/ContentTree', ContentTree);

    containerRegistry.set('ContentCanvas', ContentCanvas);

    containerRegistry.set('RightSideBar', RightSideBar);
    containerRegistry.set('RightSideBar/Inspector', Inspector);
});
