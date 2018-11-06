/* eslint-disable camelcase, react/jsx-pascal-case */
import SelectBox_ListPreview from './selectBox_ListPreview';

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import SelectBox_CreateNew from './../SelectBox_CreateNew';
import SelectBox_ListPreviewFlat from './../SelectBox_ListPreviewFlat';
import SelectBox_ListPreviewGrouped from './../SelectBox_ListPreviewGrouped';

export default injectProps({
    SelectBox_CreateNew,
    SelectBox_ListPreviewFlat,
    SelectBox_ListPreviewGrouped
})(SelectBox_ListPreview);
