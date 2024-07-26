/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {themr} from '@friendsofreactjs/react-css-themr';

import identifiers from '../identifiers';
import ContextDropDownWrapper, {
    StatelessDropDownWrapper,
    ContextDropDownHeader,
    ContextDropDownContents
} from './wrapper';

import style from './style.module.css';

const DropDown = themr(identifiers.dropDown, style)(ContextDropDownWrapper);
const StatelessDropDown = themr(identifiers.dropDown, style)(StatelessDropDownWrapper);
const DropDownHeader = themr(identifiers.dropDownHeader, style)(ContextDropDownHeader);
const DropDownContents = themr(identifiers.dropDownContents, style)(ContextDropDownContents);

export default Object.assign(DropDown, {
    Header: DropDownHeader,
    Contents: DropDownContents,
    Stateless: StatelessDropDown
});
