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
    reducer as OffCanvasReducer,
    hydrate as OffCanvasHydrator,
    actions as OffCanvas
} from './OffCanvas/index';
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
    reducer as ContentViewReducer,
    hydrate as ContentViewHydrator,
    actionTypes as ContentViewActionTypes,
    actions as ContentView
} from './ContentView/index';

//
// Export the action types
//
export const actionTypes = {
    PageTree: PageTreeActionTypes,
    ContentView: ContentViewActionTypes
};

//
// Export the actions
//
export const actions = {
    FlashMessages,
    FullScreen,
    LeftSideBar,
    OffCanvas,
    Remote,
    RightSideBar,
    AddNodeModal,
    PageTree,
    ContentView
};

//
// Export the initial state hydrators
//
export const hydrators = [
    FlashMessagesHydrator,
    FullScreenHydrator,
    LeftSideBarHydrator,
    OffCanvasHydrator,
    RemoteHydrator,
    RightSideBarHydrator,
    AddNodeModalHydrator,
    PageTreeHydrator,
    ContentViewHydrator
];

//
// Export the reducer
//
export const reducer = {
    ...FlashMessagesReducer,
    ...FullScreenReducer,
    ...LeftSideBarReducer,
    ...OffCanvasReducer,
    ...RemoteReducer,
    ...RightSideBarReducer,
    ...AddNodeModalReducer,
    ...PageTreeReducer,
    ...ContentViewReducer
};
