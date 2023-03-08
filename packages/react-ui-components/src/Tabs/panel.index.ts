import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.module.css';
import Panel from './panel';

export default themr(identifiers.tabsPanel, style)(Panel);
