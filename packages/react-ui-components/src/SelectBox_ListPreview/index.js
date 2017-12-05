/* eslint-disable camelcase, react/jsx-pascal-case */
import SelectBox_ListPreview from './selectBox_ListPreview';

//
// Dependency injection
//
import injectProps from './../_lib/injectProps.js';
import SelectBox_CreateNew from './../SelectBox_CreateNew/index';
import SelectBox_ListPreviewFlat from './../SelectBox_ListPreviewFlat/index';
import SelectBox_ListPreviewGrouped from './../SelectBox_ListPreviewGrouped/index';

export default injectProps({
    SelectBox_CreateNew,
    SelectBox_ListPreviewFlat,
    SelectBox_ListPreviewGrouped
})(SelectBox_ListPreview);
