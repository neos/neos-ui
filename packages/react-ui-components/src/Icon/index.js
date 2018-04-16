import fontawesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import solid from '@fortawesome/fontawesome-free-solid';
import regular from '@fortawesome/fontawesome-free-regular';
import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Icon from './icon.js';

fontawesome.library.add(brands, solid, regular);

const ThemedIcon = themr(identifiers.icon, style)(Icon);

export default ThemedIcon