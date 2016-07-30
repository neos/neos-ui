import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import ToggablePanel, {
    Header,
    Contents
} from './toggablePanel.js';

const ThemedToggablePanel = themr(identifiers.toggablePanel, style)(ToggablePanel);
ThemedToggablePanel.Header = themr(identifiers.toggablePanelHeader, style)(Header);
ThemedToggablePanel.Contents = themr(identifiers.toggablePanelContents, style)(Contents);

export default ThemedToggablePanel;
