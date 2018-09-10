/* eslint-disable camelcase, react/jsx-pascal-case */
import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import style from './style.css';
import MultiSelectBox from './multiSelectBox';

const ThemedMultiSelectBox = themr(identifiers.multiSelectBox, style)(MultiSelectBox);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import SelectBox from './../SelectBox';
import MultiSelectBox_ListPreviewSortable from './../MultiSelectBox_ListPreviewSortable';
import Icon from './../Icon';
import IconButton from './../IconButton';

export default injectProps({
    IconComponent: Icon,
    IconButtonComponent: IconButton,
    SelectBox,
    MultiSelectBox_ListPreviewSortable
})(ThemedMultiSelectBox);
