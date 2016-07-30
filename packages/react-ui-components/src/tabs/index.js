import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Tabs from './tabs';
import Panel from './panel';

const ThemedTabs = themr(identifiers.tabs, style)(Tabs);
ThemedTabs.Panel = themr(identifiers.tabsPanel, style)(Panel);

export default ThemedTabs;
