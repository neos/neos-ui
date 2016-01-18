import {combineReducers} from 'redux';
import FlashMessagesReducer, * as FlashMessages from './FlashMessages/';
import LeftSideBarReducer, * as LeftSideBar from './LeftSideBar/';
import OffCanvasReducer, * as OffCanvas from './OffCanvas/';
import RemoteReducer, * as Remote from './Remote/';
import RightSideBarReducer, * as RightSideBar from './RightSideBar/';
import TabsReducer, * as Tabs from './Tabs/';
import PageTreeReducer, * as PageTree from './PageTree/';

// Export reducers & state structure.
export default {
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

// Export actions
export {
    FlashMessages,
    LeftSideBar,
    OffCanvas,
    Remote,
    RightSideBar,
    Tabs,
    PageTree
};
