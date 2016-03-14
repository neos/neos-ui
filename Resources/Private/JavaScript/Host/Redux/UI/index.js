import {
    reducer as FlashMessagesReducer,
    hydrate as FlashMessagesHydrator,
    actions as FlashMessages
} from './FlashMessages/index';
import {
    reducer as FullScreenReducer,
    hydrate as FullScreenHydrator,
    actions as FullScreen
} from './FullScreen/index';
import {
    reducer as LeftSideBarReducer,
    hydrate as LeftSideBarHydrator,
    actions as LeftSideBar
} from './LeftSideBar/index';
import {
    reducer as DrawerReducer,
    hydrate as DrawerHydrator,
    actions as Drawer
} from './Drawer/index';
import {
    reducer as RemoteReducer,
    hydrate as RemoteHydrator,
    actions as Remote
} from './Remote/index';
import {
    reducer as RightSideBarReducer,
    hydrate as RightSideBarHydrator,
    actions as RightSideBar
} from './RightSideBar/index';
import {
    reducer as AddNodeModalReducer,
    hydrate as AddNodeModalHydrator,
    actions as AddNodeModal
} from './AddNodeModal/index';
import {
    reducer as PageTreeReducer,
    hydrate as PageTreeHydrator,
    actionTypes as PageTreeActionTypes,
    actions as PageTree
} from './PageTree/index';
import {
    reducer as ContentCanvasReducer,
    hydrate as ContentCanvasHydrator,
    actionTypes as ContentCanvasActionTypes,
    actions as ContentCanvas
} from './ContentCanvas/index';

import {
    reducer as InspectorReducer,
    hydrate as InspectorHydrator,
    actionTypes as InspectorActionTypes,
    actions as Inspector
} from './Inspector/index';

//
// Export the action types
//
export const actionTypes = {
    PageTree: PageTreeActionTypes,
    ContentCanvas: ContentCanvasActionTypes,
    Inspector: InspectorActionTypes
};

//
// Export the actions
//
export const actions = {
    FlashMessages,
    FullScreen,
    LeftSideBar,
    Drawer,
    Remote,
    RightSideBar,
    AddNodeModal,
    PageTree,
    ContentCanvas,
    Inspector
};

//
// Export the initial state hydrators
//
export const hydrators = [
    FlashMessagesHydrator,
    FullScreenHydrator,
    LeftSideBarHydrator,
    DrawerHydrator,
    RemoteHydrator,
    RightSideBarHydrator,
    AddNodeModalHydrator,
    PageTreeHydrator,
    ContentCanvasHydrator,
    InspectorHydrator
];

//
// Export the reducer
//
export const reducer = {
    ...FlashMessagesReducer,
    ...FullScreenReducer,
    ...LeftSideBarReducer,
    ...DrawerReducer,
    ...RemoteReducer,
    ...RightSideBarReducer,
    ...AddNodeModalReducer,
    ...PageTreeReducer,
    ...ContentCanvasReducer,
    ...InspectorReducer
};
