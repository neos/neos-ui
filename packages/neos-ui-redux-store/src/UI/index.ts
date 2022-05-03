import {combineReducers} from '../combineReducers';

import * as FlashMessages from './FlashMessages';
import * as FullScreen from './FullScreen';
import * as KeyboardShortcutModal from './KeyboardShortcutModal';
import * as LeftSideBar from './LeftSideBar';
import * as EditPreviewMode from './EditPreviewMode';
import * as Drawer from './Drawer';
import * as Remote from './Remote';
import * as NodeLinking from './NodeLinking';
import * as RightSideBar from './RightSideBar';
import * as AddNodeModal from './AddNodeModal';
import * as PageTree from './PageTree';
import * as ContentCanvas from './ContentCanvas';
import * as Inspector from './Inspector';
import * as InsertionModeModal from './InsertionModeModal';
import * as SelectNodeTypeModal from './SelectNodeTypeModal';
import * as NodeCreationDialog from './NodeCreationDialog';
import * as NodeVariantCreationDialog from './NodeVariantCreationDialog';
import * as ContentTree from './ContentTree';

const all = {
    FlashMessages,
    FullScreen,
    KeyboardShortcutModal,
    LeftSideBar,
    EditPreviewMode,
    Drawer,
    Remote,
    RightSideBar,
    AddNodeModal,
    PageTree,
    ContentCanvas,
    Inspector,
    InsertionModeModal,
    NodeLinking,
    SelectNodeTypeModal,
    NodeCreationDialog,
    NodeVariantCreationDialog,
    ContentTree
};

function typedKeys<T>(o: T) : Array<keyof T> {
    return Object.keys(o) as Array<keyof T>;
}

//
// Export the reducer state shape interface
//
export interface State {
    flashMessages: FlashMessages.State;
    fullScreen: FullScreen.State;
    keyboardShortcutModal: KeyboardShortcutModal.State;
    leftSideBar: LeftSideBar.State;
    editPreviewMode: EditPreviewMode.State;
    drawer: Drawer.State;
    remote: Remote.State;
    rightSideBar: RightSideBar.State;
    addNodeModal: AddNodeModal.State;
    pageTree: PageTree.State;
    contentCanvas: ContentCanvas.State;
    inspector: Inspector.State;
    insertionModeModal: InsertionModeModal.State;
    selectNodeTypeModal: SelectNodeTypeModal.State;
    nodeCreationDialog: NodeCreationDialog.State;
    nodeVariantCreationDialog: NodeVariantCreationDialog.State;
    contentTree: ContentTree.State;
}

//
// Export the actionTypes
//
export const actionTypes = typedKeys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].actionTypes}), {});

//
// Export the actions
//
export const actions = typedKeys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].actions}), {});


//
// Export the reducer
//
export const reducer = combineReducers({
    flashMessages: FlashMessages.reducer,
    fullScreen: FullScreen.reducer,
    keyboardShortcutModal: KeyboardShortcutModal.reducer,
    leftSideBar: LeftSideBar.reducer,
    editPreviewMode: EditPreviewMode.reducer,
    drawer: Drawer.reducer,
    remote: Remote.reducer,
    rightSideBar: RightSideBar.reducer,
    addNodeModal: AddNodeModal.reducer,
    pageTree: PageTree.reducer,
    contentCanvas: ContentCanvas.reducer,
    inspector: Inspector.reducer,
    insertionModeModal: InsertionModeModal.reducer,
    selectNodeTypeModal: SelectNodeTypeModal.reducer,
    nodeCreationDialog: NodeCreationDialog.reducer,
    nodeVariantCreationDialog: NodeVariantCreationDialog.reducer,
    contentTree: ContentTree.reducer
} as any); // TODO: when we update redux, this shouldn't be necessary https://github.com/reduxjs/redux/issues/2709#issuecomment-357328709

//
// Export the selectors
//
export const selectors = typedKeys(all).reduce((acc, cur) => ({...acc, [cur]: all[cur].selectors}), {});
