import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Tabs from './tabs';
import Panel from './panel';

const ThemedTabs = themr(identifiers.tabs, style)(Tabs);
ThemedTabs.Panel = themr(identifiers.tabsPanel, style)(Panel);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../icon/index';

export default injectProps({
    IconComponent: Icon
})(ThemedTabs);
