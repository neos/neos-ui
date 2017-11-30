import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';

import SelectBox_ListPreviewSortable from './SelectBox_ListPreviewSortable';

const ThemedSelectBox_ListPreviewSortable = themr(identifiers.selectBox_ListPreviewSortable, style)(SelectBox_ListPreviewSortable);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import SelectBox_ListPreviewUngrouped from './../SelectBox_ListPreviewUngrouped/index';

export default injectProps({
    SelectBox_ListPreviewUngrouped
})(ThemedSelectBox_ListPreviewSortable);



