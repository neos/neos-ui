// Third party
import compose from 'lodash.compose';
import curry from 'lodash.curry';

const _ = curry.placeholder;

// Import Reducers
import FlashMessagesReducer from './FlashMessages/';
import LeftSideBarReducer from './LeftSideBar/';
import OffCanvasReducer from './OffCanvas/';
import RemoteReducer from './Remote/';
import RightSideBarReducer from './RightSideBar/';
import TabsReducer from './Tabs/';
import PageTreeReducer from './PageTree/';

// Import Actions
import * as FlashMessages from './FlashMessages/';
import * as LeftSideBar from './LeftSideBar/';
import * as OffCanvas from './OffCanvas/';
import * as Remote from './Remote/';
import * as RightSideBar from './RightSideBar/';
import * as Tabs from './Tabs/';
import * as PageTree from './PageTree/';

// Export Reducer
export default function reducer(state, action) {
    return compose(
        curry(FlashMessagesReducer)(_, action),
        curry(LeftSideBarReducer)(_, action),
        curry(OffCanvasReducer)(_, action),
        curry(RemoteReducer)(_, action),
        curry(RightSideBarReducer)(_, action),
        curry(TabsReducer)(_, action),
        curry(PageTreeReducer)(_, action)
    )(state);
}

// Export Actions
export {
    FlashMessages,
    LeftSideBar,
    OffCanvas,
    Remote,
    RightSideBar,
    Tabs,
    PageTree
};
