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
import * as SyncWorkspaceModal from './SyncWorkspaceModal';
import * as ContentTree from './ContentTree';

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
    SyncWorkspaceModal: SyncWorkspaceModal.State;
    contentTree: ContentTree.State;
}

//
// Export the actionTypes
//
export const actionTypes = {
    FlashMessages: FlashMessages.actionTypes,
    FullScreen: FullScreen.actionTypes,
    KeyboardShortcutModal: KeyboardShortcutModal.actionTypes,
    LeftSideBar: LeftSideBar.actionTypes,
    EditPreviewMode: EditPreviewMode.actionTypes,
    Drawer: Drawer.actionTypes,
    Remote: Remote.actionTypes,
    RightSideBar: RightSideBar.actionTypes,
    AddNodeModal: AddNodeModal.actionTypes,
    PageTree: PageTree.actionTypes,
    ContentCanvas: ContentCanvas.actionTypes,
    Inspector: Inspector.actionTypes,
    InsertionModeModal: InsertionModeModal.actionTypes,
    NodeLinking: NodeLinking.actionTypes,
    SelectNodeTypeModal: SelectNodeTypeModal.actionTypes,
    NodeCreationDialog: NodeCreationDialog.actionTypes,
    NodeVariantCreationDialog: NodeVariantCreationDialog.actionTypes,
    SyncWorkspaceModal: SyncWorkspaceModal.actionTypes,
    ContentTree: ContentTree.actionTypes
} as const;

//
// Export the actions
//
export const actions = {
    FlashMessages: FlashMessages.actions,
    FullScreen: FullScreen.actions,
    KeyboardShortcutModal: KeyboardShortcutModal.actions,
    LeftSideBar: LeftSideBar.actions,
    EditPreviewMode: EditPreviewMode.actions,
    Drawer: Drawer.actions,
    Remote: Remote.actions,
    RightSideBar: RightSideBar.actions,
    AddNodeModal: AddNodeModal.actions,
    PageTree: PageTree.actions,
    ContentCanvas: ContentCanvas.actions,
    Inspector: Inspector.actions,
    InsertionModeModal: InsertionModeModal.actions,
    NodeLinking: NodeLinking.actions,
    SelectNodeTypeModal: SelectNodeTypeModal.actions,
    NodeCreationDialog: NodeCreationDialog.actions,
    NodeVariantCreationDialog: NodeVariantCreationDialog.actions,
    SyncWorkspaceModal: SyncWorkspaceModal.actions,
    ContentTree: ContentTree.actions
} as const;

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
    SyncWorkspaceModal: SyncWorkspaceModal.reducer,
    contentTree: ContentTree.reducer
} as any); // TODO: when we update redux, this shouldn't be necessary https://github.com/reduxjs/redux/issues/2709#issuecomment-357328709

//
// Export the selectors
//
export const selectors = {
    FlashMessages: FlashMessages.selectors,
    FullScreen: FullScreen.selectors,
    KeyboardShortcutModal: KeyboardShortcutModal.selectors,
    LeftSideBar: LeftSideBar.selectors,
    EditPreviewMode: EditPreviewMode.selectors,
    Drawer: Drawer.selectors,
    Remote: Remote.selectors,
    RightSideBar: RightSideBar.selectors,
    AddNodeModal: AddNodeModal.selectors,
    PageTree: PageTree.selectors,
    ContentCanvas: ContentCanvas.selectors,
    Inspector: Inspector.selectors,
    InsertionModeModal: InsertionModeModal.selectors,
    NodeLinking: NodeLinking.selectors,
    SelectNodeTypeModal: SelectNodeTypeModal.selectors,
    NodeCreationDialog: NodeCreationDialog.selectors,
    NodeVariantCreationDialog: NodeVariantCreationDialog.selectors,
    SyncWorkspaceModal: SyncWorkspaceModal.selectors,
    ContentTree: ContentTree.selectors
} as const;
