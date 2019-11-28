import {combineReducers} from '@neos-project/neos-ui-redux-store/src/combineReducers';

import * as FlashMessages from '@neos-project/neos-ui-redux-store/src/UI/FlashMessages';
import * as FullScreen from '@neos-project/neos-ui-redux-store/src/UI/FullScreen';
import * as KeyboardShortcutModal from '@neos-project/neos-ui-redux-store/src/UI/KeyboardShortcutModal';
import * as LeftSideBar from '@neos-project/neos-ui-redux-store/src/UI/LeftSideBar';
import * as EditPreviewMode from '@neos-project/neos-ui-redux-store/src/UI/EditPreviewMode';
import * as Drawer from '@neos-project/neos-ui-redux-store/src/UI/Drawer';
import * as Remote from '@neos-project/neos-ui-redux-store/src/UI/Remote';
import * as NodeLinking from '@neos-project/neos-ui-redux-store/src/UI/NodeLinking';
import * as RightSideBar from '@neos-project/neos-ui-redux-store/src/UI/RightSideBar';
import * as AddNodeModal from '@neos-project/neos-ui-redux-store/src/UI/AddNodeModal';
import * as PageTree from '@neos-project/neos-ui-redux-store/src/UI/PageTree';
import * as ContentCanvas from '@neos-project/neos-ui-redux-store/src/UI/ContentCanvas';
import * as Inspector from '@neos-project/neos-ui-redux-store/src/UI/Inspector';
import * as InsertionModeModal from '@neos-project/neos-ui-redux-store/src/UI/InsertionModeModal';
import * as SelectNodeTypeModal from '@neos-project/neos-ui-redux-store/src/UI/SelectNodeTypeModal';
import * as NodeCreationDialog from '@neos-project/neos-ui-redux-store/src/UI/NodeCreationDialog';
import * as NodeVariantCreationDialog from '@neos-project/neos-ui-redux-store/src/UI/NodeVariantCreationDialog';
import * as ContentTree from '@neos-project/neos-ui-redux-store/src/UI/ContentTree';

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
