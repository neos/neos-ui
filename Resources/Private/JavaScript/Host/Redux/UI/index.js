import {map, keys} from 'ramda';
import {handleActions} from 'Shared/Utilities/index';

import * as FlashMessages from './FlashMessages/index';
import * as FullScreen from './FullScreen/index';
import * as LeftSideBar from './LeftSideBar/index';
import * as Drawer from './Drawer/index';
import * as Remote from './Remote/index';
import * as RightSideBar from './RightSideBar/index';
import * as AddNodeModal from './AddNodeModal/index';
import * as PageTree from './PageTree/index';
import * as ContentCanvas from './ContentCanvas/index';
import * as Inspector from './Inspector/index';
import * as Editors from './Editors/index';

const all = {
    FlashMessages,
    FullScreen,
    LeftSideBar,
    Drawer,
    Remote,
    RightSideBar,
    AddNodeModal,
    PageTree,
    ContentCanvas,
    Inspector,
    Editors
};

//
// Export the actionTypes
//
export const actionTypes = map(a => a.actionTypes, all);

//
// Export the actions
//
export const actions = map(a => a.actions, all);

//
// Export the reducer
//
export const reducer = handleActions(map(k => all[k].reducer, keys(all)));
