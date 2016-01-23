import {combineReducers} from 'redux';
import {
    reducer as FlashMessagesReducer,
    actions as FlashMessages
} from './FlashMessages/';
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
    reducer as TabsReducer,
    actions as Tabs
} from './Tabs/';
import {
    reducer as PageTreeReducer,
    actions as PageTree
} from './PageTree/';

//
// Export the actions
//
export const actions = {
    FlashMessages,
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
        leftSideBar: LeftSideBarReducer,
        offCanvas: OffCanvasReducer,
        remote: RemoteReducer,
        rightSideBar: RightSideBarReducer,
        tabs: TabsReducer,
        pageTree: PageTreeReducer
    })
};
