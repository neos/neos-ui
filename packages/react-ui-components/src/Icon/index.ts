import {config, IconPrefix, library} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {themr} from '@friendsofreactjs/react-css-themr';

import identifiers from '../identifiers';
import Icon from './icon';

import style from './style.css';

// tslint:disable:no-object-mutation
config.autoAddCss = false;
config.familyPrefix = 'neos-fa' as IconPrefix;
config.replacementClass = 'neos-svg-inline--fa';
// tslint:enable:no-object-mutation

library.add(fab, fas, far);

export default themr(identifiers.icon, style)(Icon);
