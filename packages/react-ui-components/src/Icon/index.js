import {library, config} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from './../identifiers';
import style from './style.css';
import Icon from './icon.js';
/* eslint-disable no-unused-vars */
import faStyle from '@fortawesome/fontawesome-svg-core/styles.css';
/* eslint-enable no-unused-vars */

config.autoAddCss = false;
config.familyPrefix = 'neos-fa';
config.replacementClass = 'neos-svg-inline--fa';
library.add(fab, fas, far);

const ThemedIcon = themr(identifiers.icon, style)(Icon);

export default ThemedIcon;
