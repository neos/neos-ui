import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.scss';
import ToggablePanel from './toggablePanel';
import Header from './toggablePanelHeader';
import Contents from './toggablePanelContents';

const ThemedToggablePanel = themr(identifiers.toggablePanel, style)(ToggablePanel);
const ThemedToggablePanelHeader = themr(identifiers.toggablePanelHeader, style)(Header);
const ThemedToggablePanelContents = themr(identifiers.toggablePanelContents, style)(Contents);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import Headline from './../Headline';
import IconButton from './../IconButton';

ThemedToggablePanel.Header = injectProps({
    HeadlineComponent: Headline,
    IconButtonComponent: IconButton
})(ThemedToggablePanelHeader);
ThemedToggablePanel.Contents = ThemedToggablePanelContents;

export default ThemedToggablePanel;
