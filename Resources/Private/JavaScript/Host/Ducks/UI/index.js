// Third party
import compose from 'lodash.compose';

// Import Reducers
import FlashMessagesReducer from './FlashMessages/';
import LeftSideBarReducer from './LeftSideBar/';
import OffCanvasReducer from './OffCanvas/';
import RemoteReducer from './Remote/';
import RightSidebarReducer from './RightSidebar/';
import TabsReducer from './Tabs/';

// Import Actions
import * as FlashMessages from './FlashMessages/';
import * as LeftSideBar from './LeftSideBar/';
import * as OffCanvas from './OffCanvas/';
import * as Remote from './Remote/';
import * as RightSidebar from './RightSidebar/';
import * as Tabs from './Tabs/';

// Export Reducer
export default function reducer(state, action) {
    return compose(
        FlashMessagesReducer,
        LeftSideBarReducer,
        OffCanvasReducer,
        RemoteReducer,
        RightSidebarReducer,
        TabsReducer
    );
};

// Export Actions
export {
    FlashMessages,
    LeftSideBar,
    OffCanvas,
    Remote,
    RightSidebar,
    Tabs
};
