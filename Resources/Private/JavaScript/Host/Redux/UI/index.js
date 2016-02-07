import {combineReducers} from 'redux';
import {
    reducer as FlashMessagesReducer,
    events as FlashMessagesEvents,
    actions as FlashMessages
} from './FlashMessages/';
import {
    reducer as FullScreenReducer,
    events as FullScreenEvents,
    actions as FullScreen
} from './FullScreen/';
import {
    reducer as LeftSideBarReducer,
    events as LeftSideBarEvents,
    actions as LeftSideBar
} from './LeftSideBar/';
import {
    reducer as OffCanvasReducer,
    events as OffCanvasEvents,
    actions as OffCanvas
} from './OffCanvas/';
import {
    reducer as RemoteReducer,
    events as RemoteEvents,
    actions as Remote
} from './Remote/';
import {
    reducer as RightSideBarReducer,
    events as RightSideBarEvents,
    actions as RightSideBar
} from './RightSideBar/';
import {
    reducer as TabsReducer,
    events as TabsEvents,
    actions as Tabs
} from './Tabs/';
import {
    reducer as PageTreeReducer,
    events as PageTreeEvents,
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
    Tabs,
    PageTree
};

//
// Export the reducer
//
export const reducer = {
    ui: combineReducers({
        flashMessages: FlashMessagesReducer,
        fullScreen: FullScreenReducer,
        leftSideBar: LeftSideBarReducer,
        offCanvas: OffCanvasReducer,
        remote: RemoteReducer,
        rightSideBar: RightSideBarReducer,
        tabs: TabsReducer,
        pageTree: PageTreeReducer
    })
};

//
// Export the event map
//
export const events = {
    ...FlashMessagesEvents,
    ...FullScreenEvents,
    ...LeftSideBarEvents,
    ...OffCanvasEvents,
    ...RemoteEvents,
    ...RightSideBarEvents,
    ...TabsEvents,
    ...PageTreeEvents
};
