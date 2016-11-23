import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Tabs from './tabs';
import Panel from './panel';

const ThemedTabs = themr(identifiers.tabs, style)(Tabs);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import Icon from './../Icon/index';

const FinalTabsComponent = injectProps({
    IconComponent: Icon
})(ThemedTabs);
FinalTabsComponent.Panel = themr(identifiers.tabsPanel, style)(Panel);

export default FinalTabsComponent;
