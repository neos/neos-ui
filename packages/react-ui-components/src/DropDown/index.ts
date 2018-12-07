import {themr} from '@friendsofreactjs/react-css-themr';

import identifiers from '@neos-project/react-ui-components/src/identifiers';
import ContextDropDownWrapper, {
    StatelessDropDownWrapper,
    ContextDropDownHeader,
    ContextDropDownContents
} from '@neos-project/react-ui-components/src/DropDown/wrapper';

import style from './style.css';

const DropDown = themr(identifiers.dropDown, style)(ContextDropDownWrapper);
const StatelessDropDown = themr(identifiers.dropDown, style)(StatelessDropDownWrapper);
const DropDownHeader = themr(identifiers.dropDownHeader, style)(ContextDropDownHeader);
const DropDownContents = themr(identifiers.dropDownContents, style)(ContextDropDownContents);

// @ts-ignore
DropDown.Header = DropDownHeader;
// @ts-ignore
DropDown.Contents = DropDownContents;
// @ts-ignore
DropDown.Stateless = StatelessDropDown;

export default DropDown as typeof DropDown & {
    Header: typeof DropDownHeader;
    Contents: typeof DropDownContents;
    Stateless: typeof StatelessDropDown;
};
