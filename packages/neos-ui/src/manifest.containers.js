import manifest from '@neos-project/neos-ui-extensibility';

import Modals from './Containers/Modals/index';
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
    containerRegistry.add('FullScreen', FullScreen);
    containerRegistry.add('PrimaryToolbar', PrimaryToolbar);
    containerRegistry.add('EditModePanel', EditModePanel);
    containerRegistry.add('SecondaryToolbar', SecondaryToolbar);
    containerRegistry.add('Drawer', Drawer);
    containerRegistry.add('LeftSideBar', LeftSideBar);
    containerRegistry.add('ContentCanvas', ContentCanvas);
    containerRegistry.add('RightSideBar', RightSideBar);
});
