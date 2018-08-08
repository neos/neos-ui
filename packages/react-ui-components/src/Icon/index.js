import {library, config} from '@fortawesome/fontawesome-svg-core';
import brands from '@fortawesome/free-brands-svg-icons';
import solid from '@fortawesome/free-solid-svg-icons';
import regular from '@fortawesome/free-regular-svg-icons';
import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Icon from './icon.js';
/* eslint-disable no-unused-vars */
import faStyle from '@fortawesome/fontawesome-svg-core/styles.css';
/* eslint-enable no-unused-vars */

config.autoAddCss = false;
config.familyPrefix = 'neos-fa';
config.replacementClass = 'neos-svg-inline--fa';
library.add(brands, solid, regular);

const ThemedIcon = themr(identifiers.icon, style)(Icon);

export default ThemedIcon;
