import {
    reducer as FlashMessagesReducer,
    actions as FlashMessages
} from './FlashMessages/';
import {
    reducer as FullScreenReducer,
    actions as FullScreen
} from './FullScreen/';
import {
    reducer as LeftSideBarReducer,
    actions as LeftSideBar
} from './LeftSideBar/';
import {
    reducer as OffCanvasReducer,
    actions as OffCanvas
} from './OffCanvas/';
import {
    reducer as RemoteReducer,
    actions as Remote
} from './Remote/';
import {
    reducer as RightSideBarReducer,
    actions as RightSideBar
} from './RightSideBar/';
import {
    reducer as PageTreeReducer,
    actions as PageTree
} from './PageTree/';

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
    PageTree
};

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
    ...PageTreeReducer
};
