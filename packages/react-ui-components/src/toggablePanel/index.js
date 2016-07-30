import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import ToggablePanel, {
    Header,
    Contents
} from './toggablePanel.js';

const ThemedToggablePanel = themr(identifiers.toggablePanel, style)(ToggablePanel);
const ThemedToggablePanelHeader = themr(identifiers.toggablePanelHeader, style)(Header);
const ThemedToggablePanelContents = themr(identifiers.toggablePanelContents, style)(Contents);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Headline from './../headline/index';
import IconButton from './../iconButton/index';

ThemedToggablePanel.Header = injectProps({
    HeadlineComponent: Headline,
    IconButtonComponent: IconButton
})(ThemedToggablePanelHeader);
ThemedToggablePanel.Contents = ThemedToggablePanelContents;

export default ThemedToggablePanel;
