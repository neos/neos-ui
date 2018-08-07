import fontawesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import solid from '@fortawesome/fontawesome-free-solid';
import regular from '@fortawesome/fontawesome-free-regular';
import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Icon from './icon.js';
/* eslint-disable no-unused-vars */
import faStyle from '@fortawesome/fontawesome/styles.css';
/* eslint-enable no-unused-vars */

fontawesome.config.autoAddCss = false;
fontawesome.config.familyPrefix = 'neos-fa';
fontawesome.config.replacementClass = 'neos-svg-inline--fa';
fontawesome.library.add(brands, solid, regular);

const ThemedIcon = themr(identifiers.icon, style)(Icon);

export default ThemedIcon;
